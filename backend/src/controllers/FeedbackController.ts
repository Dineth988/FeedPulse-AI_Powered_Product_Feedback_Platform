import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';
import { analyseFeedback } from '../services/gemini.services';

const send = (
  res: Response,
  status: number,
  payload: { success: boolean; data?: unknown; message?: string; error?: string }
) => res.status(status).json(payload);

// ─── POST /api/feedback ───────────────────────────────────────────────────────
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return send(res, 400, { success: false, error: 'Title is required.' });
    }
    if (!description || typeof description !== 'string' || description.trim().length < 20) {
      return send(res, 400, { success: false, error: 'Description must be at least 20 characters.' });
    }
    if (!category) {
      return send(res, 400, { success: false, error: 'Category is required.' });
    }

    // Save to MongoDB first — AI is secondary
    const feedback = await Feedback.create({
      title: title.trim(),
      description: description.trim(),
      category,
      submitterName: submitterName?.trim() || undefined,
      submitterEmail: submitterEmail?.trim().toLowerCase() || undefined,
    });

    // Trigger Gemini analysis in background — never blocks the response
    runGeminiAnalysis(feedback._id.toString(), title.trim(), description.trim());

    return send(res, 201, {
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully.',
    });
  } catch (err: unknown) {
    console.error('[submitFeedback]', err);
    if (isValidationError(err)) {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return send(res, 400, { success: false, error: messages.join(', ') });
    }
    return send(res, 500, { success: false, error: 'Server error. Please try again.' });
  }
};

// ─── Gemini runs after response is sent — failure never affects submission ────
async function runGeminiAnalysis(id: string, title: string, description: string) {
  try {
    const analysis = await analyseFeedback(title, description);
    await Feedback.findByIdAndUpdate(id, {
      ai_category:  analysis.category,
      ai_sentiment: analysis.sentiment,
      ai_priority:  analysis.priority_score,
      ai_summary:   analysis.summary,
      ai_tags:      analysis.tags,
      ai_processed: true,
    });
    console.log(`[Gemini] ✅ Analysis complete for ${id}`);
  } catch (err) {
    // Log but do not crash — feedback is already saved safely
    console.error(`[Gemini] ❌ Analysis failed for ${id}:`, err);
  }
}


export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { category, status, page = '1', limit = '10', sort = 'createdAt', order = 'desc' } = req.query;

    const filter: Record<string, string> = {};
    if (category) filter.category = category as string;
    if (status)   filter.status   = status as string;

    const pageNum  = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, parseInt(limit as string));
    const skip     = (pageNum - 1) * limitNum;
    const sortDir  = order === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Feedback.find(filter).sort({ [sort as string]: sortDir }).skip(skip).limit(limitNum).lean(),
      Feedback.countDocuments(filter),
    ]);

    return send(res, 200, {
      success: true,
      data: {
        items,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (err) {
    console.error('[getAllFeedback]', err);
    return send(res, 500, { success: false, error: 'Server error.' });
  }
};

// ─── GET /api/feedback/:id ────────────────────────────────────────────────────
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id).lean();
    if (!feedback) return send(res, 404, { success: false, error: 'Feedback not found.' });
    return send(res, 200, { success: true, data: feedback });
  } catch (err) {
    console.error('[getFeedbackById]', err);
    return send(res, 500, { success: false, error: 'Server error.' });
  }
};

// ─── PATCH /api/feedback/:id ──────────────────────────────────────────────────
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const allowed = ['New', 'In Review', 'Resolved'];
    if (!status || !allowed.includes(status)) {
      return send(res, 400, { success: false, error: `Status must be one of: ${allowed.join(', ')}` });
    }
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();
    if (!feedback) return send(res, 404, { success: false, error: 'Feedback not found.' });
    return send(res, 200, { success: true, data: feedback, message: `Status updated to "${status}".` });
  } catch (err) {
    console.error('[updateFeedbackStatus]', err);
    return send(res, 500, { success: false, error: 'Server error.' });
  }
};

// ─── DELETE /api/feedback/:id ─────────────────────────────────────────────────
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id).lean();
    if (!feedback) return send(res, 404, { success: false, error: 'Feedback not found.' });
    return send(res, 200, { success: true, message: 'Feedback deleted.' });
  } catch (err) {
    console.error('[deleteFeedback]', err);
    return send(res, 500, { success: false, error: 'Server error.' });
  }
};


function isValidationError(err: unknown): err is { name: string; errors: Record<string, unknown> } {
  return typeof err === 'object' && err !== null && (err as any).name === 'ValidationError';
}
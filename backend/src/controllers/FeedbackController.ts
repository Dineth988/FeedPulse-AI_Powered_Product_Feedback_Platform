import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';

const send = (
  res: Response,
  status: number,
  payload: { success: boolean; data?: unknown; message?: string; error?: string }
) => res.status(status).json(payload);


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

    const feedback = await Feedback.create({
      title: title.trim(),
      description: description.trim(),
      category,
      submitterName: submitterName?.trim() || undefined,
      submitterEmail: submitterEmail?.trim().toLowerCase() || undefined,
    });

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


export const getAllFeedback = async (_req: Request, res: Response) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 }).lean();
    return send(res, 200, { success: true, data: items });
  } catch (err) {
    console.error('[getAllFeedback]', err);
    return send(res, 500, { success: false, error: 'Server error.' });
  }
};

function isValidationError(
  err: unknown
): err is { name: string; errors: Record<string, unknown> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as any).name === 'ValidationError'
  );
}
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/server/errors";

type ErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null
    },
    init
  );
}

export function apiError(error: ErrorPayload, status: number) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.flatten()
      },
      400
    );
  }

  if (error instanceof AppError) {
    return apiError(
      {
        code: error.code,
        message: error.message
      },
      error.statusCode
    );
  }

  console.error(error);

  return apiError(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong."
    },
    500
  );
}

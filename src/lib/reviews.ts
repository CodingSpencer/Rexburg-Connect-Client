const API_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:5001";

export interface Review {
  _id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  reviewCount: number;
  averageRating: number;
}

export interface CreateReviewInput {
  rating: number;
  comment: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data as T;
}

export async function getEventReviews(
  eventId: string
): Promise<ReviewsResponse> {
  const response = await fetch(
    `${API_URL}/api/events/${eventId}/reviews`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return parseResponse<ReviewsResponse>(response);
}

export async function createEventReview(
  eventId: string,
  input: CreateReviewInput
): Promise<{ message: string; review: Review }> {
  const response = await fetch(
    `${API_URL}/api/events/${eventId}/reviews`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  return parseResponse<{ message: string; review: Review }>(
    response
  );
}

export async function updateEventReview(
  reviewId: string,
  input: CreateReviewInput
): Promise<{ message: string; review: Review }> {
  const response = await fetch(
    `${API_URL}/api/reviews/${reviewId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  return parseResponse<{ message: string; review: Review }>(
    response
  );
}

export async function deleteEventReview(
  reviewId: string
): Promise<{ message: string }> {
  const response = await fetch(
    `${API_URL}/api/reviews/${reviewId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return parseResponse<{ message: string }>(response);
}
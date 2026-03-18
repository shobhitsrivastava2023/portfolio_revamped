import { NextResponse } from "next/server";

/**
 * Redirect to the PoW calendar in the viewer's Google Calendar UI.
 *
 * Note: This doesn't "open the developer's account". It opens the specific calendar
 * by Calendar ID (cid). If the calendar is not shared/public, viewers won't see it.
 */
export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const publicUrl = process.env.POW_CALENDAR_PUBLIC_URL;

  // If you want an exact shareable URL (public calendar / share link), set POW_CALENDAR_PUBLIC_URL.
  if (publicUrl && (publicUrl.startsWith("https://") || publicUrl.startsWith("http://"))) {
    return NextResponse.redirect(publicUrl);
  }

  // Otherwise, use cid= to open that calendar in the user's Calendar UI.
  // Calendar IDs often include "@" and must be URL-encoded.
  if (calendarId) {
    const cid = encodeURIComponent(calendarId);
    return NextResponse.redirect(`https://calendar.google.com/calendar/u/0/r?cid=${cid}`);
  }

  return NextResponse.redirect("https://calendar.google.com/calendar/u/0/r");
}


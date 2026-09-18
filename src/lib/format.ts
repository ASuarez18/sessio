export function formatDate(
  value: string | Date,
  locales: Intl.LocalesArgument = "en-US",
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  return new Date(value).toLocaleDateString(locales, options);
}

export function formatTime(
  value: string | Date,
  locales: Intl.LocalesArgument = "en-US",
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" },
): string {
  return new Date(value).toLocaleTimeString(locales, options);
}

export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export const formatDate = (date: string | undefined) => {
  if (date) {
    const formatted = new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      weekday: "long",
      timeZone: "Europe/Moscow",
    });
    return formatted;
  }
};

export async function shareResult(foodName, categoryLabel) {
  const text = `Aku nak makan ${foodName} harini! 🍽️\nDapatkan cadangan makanan kamu di Nak Makan Apa? 👉 https://tfqnet.github.io/nak-makan-apa`;

  // Try native share sheet (mobile)
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function whatsappShare(foodName) {
  const text = encodeURIComponent(
    `Aku nak makan ${foodName} harini! 🍽️ Cuba teka makanan kamu di Nak Makan Apa? 👉 https://tfqnet.github.io/nak-makan-apa`
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

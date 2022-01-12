import numeral from "numeral";

if (numeral.locales["en-ph"] === undefined) {
  numeral.register("locale", "en-ph", {
    delimiters: {
      thousands: ",",
      decimal: ".",
    },
    abbreviations: {
      thousand: "k",
      million: "m",
      billion: "b",
      trillion: "t",
    },
    // ordinal (number) {
    // 		return number === 1 ? 'er' : 'ème';
    // },
    currency: {
      symbol: "₱",
    },
  });
}

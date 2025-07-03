fetch('countries.json')
  .then(response => response.json())
  .then(countries => {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    countries.forEach(({ name, currency, flag }) => {
      // Some entries might not have valid symbol
      const symbol = (currency.symbol && currency.symbol !== "false") ? currency.symbol : currency.code;

      const label = `${symbol} ${currency.code} - ${name}`;
      const option1 = new Option(label, currency.code);
      const option2 = new Option(label, currency.code);

      option1.setAttribute("data-flag", flag);
      option2.setAttribute("data-flag", flag);

      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    // Init Select2
    $('.currency-select').select2({
      templateResult: formatFlag,
      templateSelection: formatFlag,
      placeholder: "Search currency..."
    });

    function formatFlag(state) {
      if (!state.id) return state.text;
      const flag = $(state.element).data('flag');
      const text = state.text;
      return $(`<span><img src="data:image/png;base64,${flag}" style="width:20px; height:14px; margin-right:8px;" /> ${text}</span>`);
    }
  })
  .catch(error => console.error('Error loading currencies:', error));
function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const resultElement = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  resultElement.textContent = "Converting... 🔄";

  fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    .then(response => response.json())
    .then(data => {
      const rate = data.rates[to];
      if (!rate) {
        resultElement.textContent = `❌ Conversion not available from ${from} to ${to}`;
        return;
      }

      const converted = (amount * rate).toFixed(2);
      const fromText = $('#fromCurrency').select2('data')[0].text.split(" ")[0]; // symbol
      const toText = $('#toCurrency').select2('data')[0].text.split(" ")[0];     // symbol

      resultElement.textContent = `${fromText}${amount} = ${toText}${converted}`;
    })
    .catch(error => {
      console.error("Conversion error:", error);
      resultElement.textContent = "❌ Failed to fetch exchange rates.";
    });
}

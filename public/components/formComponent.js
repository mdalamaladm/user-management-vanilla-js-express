import { setCSS } from "../utils.js";

export function formComponent (name, inputs, data) {
  setCSS('form-component', `
    .${name}-label {
      display: block;
      margin: 0 0 8px;
    }
  `);

  const inputsArray = [];

  for (const inputName in inputs) {
    const input = inputs[inputName];

    if (input.type === 'textarea') {
      inputsArray.push(`
      <label class="${name}-label">
        <span>${input.label}</span>
        <textarea name="${inputName}" class="${name}-input">${data[inputName]}</textarea>
      </label>
      <br>
      `)
    } else {
      inputsArray.push(`
      <label class="${name}-label">
        <span>${input.label}</span>
        <input type="${input.type}" name="${inputName}" class="${name}-input" value="${data[inputName]}"/>
      </label>
      <br>
      `)
    }
  }

  return `
    <form class="${name}-form">
      ${inputsArray.join('\n')}
      <button type="submit">Submit</button>
    </form>`
}

formComponent.init = (name, callback) => {
  const form = document.querySelector(`.${name}-form`);

  form.onsubmit = async (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll(`.${name}-input`);

    const payload = {};

    for (const input of inputs) {
      payload[input.getAttribute('name')] = input.value;
    }

    callback(payload);
  };
}
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
    const dataInput = data?.[inputName] || '';

    if (input.type === 'textarea') {
      inputsArray.push(`
      <label class="${name}-label">
        <span>${input.label}</span>
        <textarea name="${inputName}" class="${name}-input">${dataInput}</textarea>
      </label>
      <br>
      `);
    } else if (input.type === 'select') {
      inputsArray.push(`
      <label class="${name}-label">
        <span>${input.label}</span>
        <select name="${inputName}" class="${name}-input">
          ${input.items.map(item => `
            <option
              value="${item[input.itemValue]}"
              ${item[input.itemValue] === dataInput ? 'selected' : ''}
            >
              ${item[input.itemText]}
            </option>
          `).join('\n')}
        </select>
      </label>
      <br>
      `);
    } else if (input.type === 'multicheckbox') {
      inputsArray.push(`
      <fieldset>
        <legend>${input.label}</legend>
        ${input.items.map((item, index) => `
          <label class="${name}-label">
            <span>${item[input.itemText]}</span>
            <input
              type="checkbox"
              name="${inputName}"
              class="${name}-input ${inputName}-multicheckbox"
              value="${item[input.itemValue]}"
              ${dataInput.includes(item[input.itemValue] ) ? 'checked' : ''}
            />
          </label>
        `).join('\n')}
      </fieldset>
      `)
    } else {
      inputsArray.push(`
      <label class="${name}-label">
        <span>${input.label}</span>
        <input type="${input.type}" name="${inputName}" class="${name}-input" value="${dataInput}"/>
      </label>
      <br>
      `);
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
      if (input.classList.contains(`${input.getAttribute('name')}-multicheckbox`)) {
        if (payload[input.getAttribute('name')]) {
          if (input.checked) payload[input.getAttribute('name')].push(input.value)
        } else {
          if (input.checked) payload[input.getAttribute('name')] = [input.value];
          else payload[input.getAttribute('name')] = [];
        }
      } else {
        payload[input.getAttribute('name')] = input.value;
      }
    }

    callback(payload);
  };
}
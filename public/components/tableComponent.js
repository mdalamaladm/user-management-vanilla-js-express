export function tableComponent (name, option) {
  const columnsElement = [];
  for (const name in option.columns) {
    const column = option.columns[name];
    
    columnsElement.push(`
      <th>${column}</th>
    `);
  }

  if (option.edit) {
    columnsElement.push(`<th></th>`);
  }

  if (option.remove) {
    columnsElement.push(`<th></th>`);
  }

  const dataElement = [];
  for (const index in option.data) {
    const row = option.data[index];

    const rowElement = [];

    for (const name in option.columns) {
      const cell = row[name];

      rowElement.push(`
        <td>${cell}</td>
      `);
    }

    if (option.edit) {
      rowElement.push(`
        <td><button class="${name}-table-edit">Edit</button></td>
      `)
    }

    if (option.remove) {
      rowElement.push(`
        <td><button class="${name}-table-remove">Remove</button></td>
      `)
    }

    dataElement.push(`
      <tr>${rowElement.join('\n')}</tr>
    `);
  }

  return `
    <table>
      <thead>
        <tr>
          ${columnsElement.join('\n')}
        </tr>
      </thead>
      <tbody>
        ${dataElement.join('\n')}
      </tbody>
    </table>
  `;
}

tableComponent.init = ({ name, edit, remove }) => {
  if (edit) {
    const editButtons = document.querySelectorAll(`.${name}-table-edit`);

    Array.from(editButtons).forEach((button, index) => {
      button.onclick = () => { edit(index) }
    });
  }

  if (remove) {
    const removeButtons = document.querySelectorAll(`.${name}-table-remove`);

    Array.from(removeButtons).forEach((button, index) => {
      button.onclick = () => { remove(index) }
    });
  }
}
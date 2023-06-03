import { setCSS } from "../utils.js";

export function dialogComponent (child) {
  const dialogLayout = document.body.querySelector('.dialog-layout');
  
  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
  <div class="dialog">
    <div class="dialog-header">
      <button class="dialog-close-button">Close</button>
    </div>
    ${child}
  </div>`;

  dialogLayout.classList.add('dialog-layout--show');
  dialogLayout.append(wrapper);

  const dialogCloseButton = document.querySelector('.dialog-close-button');
  dialogCloseButton.onclick = () => {
    dialogLayout.classList.remove('dialog-layout--show');
    wrapper.remove();
  }

  return () => {
    dialogLayout.classList.remove('dialog-layout--show');
    wrapper.remove();
  }
}

dialogComponent.init = function () {
  setCSS('dialog-component', `
  .dialog-layout--show {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color:rgba(51, 51, 51, 0.6)
  }
  
  .dialog {
    margin: 10px;
    padding: 20px;
    background-color: rgb(243, 243, 243);
  }

  .dialog-header {
    display: flex;
    justify-content: flex-end;
    margin: 0 0 16px;
  }
  `);

  const dialogLayout = document.createElement('div');
  dialogLayout.classList.add('dialog-layout');
  document.body.append(dialogLayout);
}

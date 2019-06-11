/**
 * @component_name jj checkbox
 * @component_desc Checkbox which could interact with each others.
 * @attribute value, the value of the checkbox,	string,	/, Option
 * @attribute label, label for checkbox, string, /, Option
 * @attribute checked, check the box if set, /, /, /
 * @attribute disabled, disable the box if set, /, /, /
 */

const template = document.createElement('template');
template.innerHTML = `
  <style>
      @import url("https://unpkg.com/element-ui/lib/theme-chalk/checkbox.css");

      .el-checkbox {
        font-family: var(--label-font, Helvetica, Arial, sans-serif);
        color: var(--label-color, #606266);
      }

      .el-checkbox__input.is-checked+.el-checkbox__label {
        color: var(--label-color-checked, #409EFF)
      }

      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: var(--box-color-checked, #409EFF);
        border-color: var(--box-border-color-checked, #409EFF);
      }

      .el-checkbox__inner {
        background-color: var(--box-color, #FFFFFF);
        border: 1px solid var(--box-border-color, #DCDFE6);
      }

      .el-checkbox__inner:hover {
        border-color: var(--box-border-color-hover, #409EFF);
      }
  </style>

  <div>
    <label role="checkbox" aria-checked="true" class="el-checkbox" id="checkbox_body">
        <span aria-checked="mixed" class="el-checkbox__input">
          <span class="el-checkbox__inner"></span>
          <input type="checkbox" aria-hidden="true" class="el-checkbox__original" value="">
        </span>
        <span class="el-checkbox__label"><span></span><!----></span>
    </label>
  </div>
  `;

class JJCheckbox extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));

    // target elements with querySelector
    this.checkboxContainer = this.root.querySelector("label.el-checkbox");
    this.checkboxInputSpan = this.root.querySelector("span.el-checkbox__input");
    this.labelSpan = this.root.querySelector(".el-checkbox__label span");

    // Bind "this" to functions to reserve context
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.addClasses = this.addClasses.bind(this);
    this.removeClasses = this.removeClasses.bind(this);
    this.classNameSwitch = this.classNameSwitch.bind(this);
  }

  // Helper function to add classes to elements
  addClasses(attr) {
    this.checkboxContainer.classList.add(`is-${attr}`);
    this.checkboxInputSpan.classList.add(`is-${attr}`);
  }

  // Helper function to remove classes from elements
  removeClasses(attr) {
    this.checkboxContainer.classList.remove(`is-${attr}`);
    this.checkboxInputSpan.classList.remove(`is-${attr}`);
  }

  // Helper function for attributeChangedCallback
  classNameSwitch(attr, value) {
    if (value !== null) {
      this.addClasses(attr);
    } else {
      this.removeClasses(attr);
    }
  }

  connectedCallback() {
    // Bind event listener to checkbox elements
    this.checkboxContainer.addEventListener('mousedown', this.onCheckboxClick);

    if (this.hasAttribute('value')) {
      this._value = this.getAttribute('value');
    } else {
      this._value = "option value";
    }

    if (this.hasAttribute('label')) {
      this.label = this.getAttribute('label');
      this.labelSpan.innerHTML = this.label;
    } else {
      this.label = "Option";
      this.labelSpan.innerHTML = this.label;
    }

    if (this.hasAttribute('checked')) {
      this.checked = true;
      this.addClasses('checked');
    } else {
      this.checked = false;
    }

    if (this.hasAttribute('disabled')) {
      this.disabled = true;
      this.addClasses('disabled');
    } else {
      this.disabled = false;
    }
  }

  onCheckboxClick(event) {
    if (!this.disabled) {
      this.checked = !this.checked;
      console.log(this.checked ? "Checked " + this._value : "Unchecked " + this._value);
      if (this.checked) {
        this.setAttribute("checked", "");
        this.addClasses('checked');
      } else {
        this.removeAttribute("checked");
        this.removeClasses('checked');
      }
    }
  }

  // Observe only the array of attribute names
  static get observedAttributes() {
    return ['label', 'checked', 'disabled'];
  }

  // Listen for changed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.labelSpan.innerHTML = newValue;
        break;
      case 'checked':
        this.classNameSwitch(name, newValue);
        break;
      case 'disabled':
        this.classNameSwitch(name, newValue);
        break;
    }
  }

  // Getters
  get value() { return this.getAttribute('value'); }
  get label() { return this.getAttribute('label'); }
  get checked() { return this.hasAttribute('checked'); }
  get disabled() { return this.hasAttribute('disabled'); }

  // Setters
  set value(newValue) { this.setAttribute('value', newValue); }
  set label(newValue) { this.setAttribute('label', newValue); }
  set checked(newValue) {
    if (newValue) {
      this.setAttribute('checked', "");
    } else {
      this.removeAttribute('checked');
    }
  }
  set disabled(newValue) {
    if (newValue) {
      this.setAttribute('disabled', "");
    } else {
      this.removeAttribute('disabled');
    }
  }
}

customElements.define('jj-checkbox', JJCheckbox);

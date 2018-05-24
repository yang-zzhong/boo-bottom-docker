import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `boo-bottom-docker`
 * a scroll effect position docker
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class BooBottomDocker extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host([raised]) {
          position: fixed;
          bottom: 0px;
        }
      </style>
      <slot></slot>
    `;
  }

  static get is() { return "bb-bottom-docker"; }

  static get properties() {
    return {
      scrollTarget: {
        type: Object,
        observer: '_scrollTargetChanged'
      },
      raised: {
        type: Boolean,
        observer: '_raisedChanged',
        reflectToAttribute: true,
        value: false,
        notify: true
      },
      _ow: Number,
      _oh: Number,
      _oy: Number,
      _oldPosition: String,
      _oldBottom: String,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.scrollTarget) {
      this.scrollTarget = window;
    }
    setTimeout(this.init.bind(this), 400);
  }

  init() {
    let rect = this.getBoundingClientRect(); 
    this._oy = rect.y + this._scrollTop();
    this._oh = rect.height;
    this._ow = rect.width;
    this._oldPosition = this.style.position;
    this._oldBottom = this.style.bottom;
    this._onScroll();
    this.style.width = this._ow + 'px';
  }

  _scrollTargetChanged(scrollTarget) {
    scrollTarget && scrollTarget.addEventListener("scroll", this._onScroll.bind(this));
  }

  _onScroll(e) {
    let scrollTop = this._scrollTop();
    if (scrollTop + BooBottomDocker.screenHeight < this._oy + this._oh) {
      this.raised = true;
    } else {
      this.raised = false;
    }
  }

  _scrollTop() {
    if (this.scrollTarget == window) {
      return document.documentElement.scrollTop;
    } else {
      return this.scrollTarget.scrollTop;
    }
  }

  _raisedChanged(raised) {
    // if (raised) {
    //   this.style.position = "fixed";
    //   this.style.bottom = "0px";
    // } else {
    //   this.style.position = this._oldPosition;
    //   this.style.bottom = this._oldBottom;
    // }
  }

  static get screenHeight() {
    if (document.documentElement.clientHeight) {
      return document.documentElement.clientHeight;
    }
    return document.body.clientHeight;
  }
}

window.customElements.define('boo-bottom-docker', BooBottomDocker);

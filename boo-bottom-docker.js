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
        reflectToAttribute: true,
        value: false,
        notify: true
      },
      offsetY: {
        type: Number,
        reflectToAttribute: true,
        value: 0
      },
      noAutoInit: {
        type: Boolean,
        value: false
      },
      initAfter: {
        type: Number,
        value: 500
      },
      contentHeight: Number,
      _ow: Number,
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
    !this.noAutoInit && setTimeout(this.init.bind(this), this.initAfter);
  }

  init() {
    this.raised = false;
    setTimeout(function() {
      let rect = this.getBoundingClientRect(); 
      this._oy = rect.y + this._scrollTop();
      this._ow = rect.width;
      this._oldPosition = this.style.position;
      this._oldBottom = this.style.bottom;
      this.style.width = this._ow + 'px';
      this._onScroll();
      this.dispatchEvent( new CustomEvent('ready'));
    }.bind(this), 1);
  }

  _scrollTargetChanged(scrollTarget) {
    scrollTarget && scrollTarget.addEventListener("scroll", this._onScroll.bind(this));
  }

  _onScroll() {
    if (!this.scrollTarget) {
      return;
    }
    let scrollTop = this._scrollTop();
    let ch = this.contentHeight;
    if (!ch) {
      let rect = this.getBoundingClientRect(); 
      ch = rect.height;
    }
    if (scrollTop + BooBottomDocker.screenHeight < this._oy + ch + this.offsetY) {
      this.raised = true;
      this.style.bottom = this.offsetY + 'px';
    } else {
      this.raised = false;
    }
  }

  _scrollTop() {
    let el = document.scrollingElement || document.documentElement;
    return el.scrollTop;
  }

  static get screenHeight() {
    if (document.documentElement.clientHeight) {
      return document.documentElement.clientHeight;
    }
    return document.body.clientHeight;
  }
}

window.customElements.define('boo-bottom-docker', BooBottomDocker);

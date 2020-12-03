// import './css/grid-minimum.css';
import './scss/style.scss';
import 'core-js/features/dom-collections/for-each';
import 'core-js/features/promise';
import 'core-js/features/array/find';
import { ajaxSend } from './ajax.js';
import { ajaxSendjquery } from './ajax-jquery.js';

ajaxSend('.form_block', '.loader');
ajaxSendjquery('.form_block_jquery', '.loader');

//скрипт для всплывающих форм
let popupBtns = document.querySelectorAll('.popup_btn');
let popupBlocks = document.querySelectorAll('.popup_block');
let popup = document.querySelector('.popup');
if (popupBtns.length && popupBlocks.length && popup) {
  for (let i = 0; i < popupBtns.length; i++) {
    popupBtns[i].onclick = function() {
      popup.classList.remove('hidden');
      let popupId = this.getAttribute('popup_id');
      for (let j = 0; j < popupBlocks.length; j++) {
        let curPopupId = popupBlocks[j].getAttribute('popup_id');
        if (popupId === curPopupId) {
          popupBlocks[j].classList.remove('hidden');
        }
      }
    }
  }
  let closeBtns = document.querySelectorAll('.close_btn');
  if (closeBtns) {
    for (let i = 0; i < closeBtns.length; i++) {
      closeBtns[i].onclick = function() {
        popupHide();
      }
    }
    popup.onclick = function(e) {
      if (e.target == this) {
        popupHide();
      }
    }
  }
}
function popupHide() {
    for (let i = 0; i < popupBlocks.length; i++) {
      popupBlocks[i].classList.add('hidden');
    }
    popup.classList.add('hidden');
}
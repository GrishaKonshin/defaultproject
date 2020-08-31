// import './css/grid-minimum.css';
import './scss/style.scss';
import 'core-js/features/dom-collections/for-each';
import 'core-js/features/promise';
import 'core-js/features/array/find';
import { formSelect } from './ajax.js';

let form_blocks = document.querySelectorAll('.form_block');
if (form_blocks.length) {
    Array.prototype.forEach.call(form_blocks, function (block) {
        formSelect(block);
        var mutationObserver = new MutationObserver(function() {
            formSelect(block);
        });
        mutationObserver.observe(block, {
          childList: true,
        });
    });
}
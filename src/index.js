// import './css/grid-minimum.css';
import './scss/style.scss';
import 'core-js/features/dom-collections/for-each';
import 'core-js/features/promise';
import 'core-js/features/array/find';
import { ajaxSend } from './ajax.js';
import { ajaxSendjquery } from './ajax-jquery.js';

ajaxSend('.form_block', '.loader');
ajaxSendjquery('.form_block_jquery', '.loader');
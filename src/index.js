// import './css/grid-minimum.css';
import './scss/style.scss';
import 'core-js/features/dom-collections/for-each';
import 'core-js/features/promise';
import 'core-js/features/array/find';
import { formSelect } from './ajax.js';
import Inputmask from 'inputmask';
//загрузка файлов
let files = document.querySelectorAll('.file_block');
files.forEach(function(file_block) {
    let file_input = file_block.querySelector('input');
    let file_label = file_block.querySelector('label');
    let file_img = file_block.querySelector('img');
    file_input.onchange = function() {
        file_label.classList.add('success');
    }
});
let docs = document.querySelectorAll('.doc_block');
docs.forEach(function(file_block) {
	let file_input = file_block.querySelector('input');
	let file_add_btn = file_block.querySelector('.add_file');
	let file_delete_btn = file_block.querySelector('.delete_file');
	let file_name_block = file_block.querySelector('.file_name');
	file_input.onchange = function() {
		let file_name = file_input.files[0].name;
        if (file_input.multiple) {
            for (var i = 1; i < file_input.files.length; i++) {
                file_name = file_name.concat(', ' + file_input.files[i].name);
            }
            // file_input.files.forEach(function(file){
            //     file_name.concat(' ' + file.name);
            // })
            file_add_btn.classList.add('hidden');
        }
		if (file_name) {
			file_name_block.classList.remove('hidden');
			file_name_block.innerText = file_name;
			file_add_btn.innerText = 'Заменить';
			file_delete_btn.classList.remove('hidden');
		}

	}
	file_add_btn.onclick = function() {
		file_input.click();
	}
	file_delete_btn.onclick = function() {
		file_input.value = '';
		file_name_block.innerText = '';
		file_name_block.classList.add('hidden');
		this.classList.add('hidden');
		file_add_btn.innerText = 'Загрузить';
        file_add_btn.classList.remove('hidden');
	}
});

let market_blocks = document.querySelectorAll('.market_table_block');
market_blocks.forEach(function(block) {
    block.onclick = function(e) {
        let block_input = block.querySelector('input');
        let block_button = block.querySelector('button');
        if (e.target !== block_input && e.target !== block_button) {
            block.classList.toggle('active');
        }
    }
})
let navbar = document.querySelector('.navbar');
let navbar_btn = document.querySelector('.navbar_btn');
if (navbar_btn) {
    let navbarClosed = localStorage.getItem('navbarClosed');
    if ((navbarClosed == 'false') && (document.body.clientWidth >= 992)) {
        navbar.classList.remove('closed');
    }
    navbar_btn.onclick = function() {
        navbar.classList.toggle('closed');
        if ((navbar.classList.contains('closed')) && (document.body.clientWidth >= 992)) {
            localStorage.setItem('navbarClosed', 'true');
        }
        else {
            localStorage.setItem('navbarClosed', 'false');
        }
    }
}
let menu_btn = document.querySelector('.menu_btn');
if (menu_btn) {
    menu_btn.onclick = function() {
        navbar.classList.toggle('closed');
        body.classList.toggle('menu_opened');
    }
}

let theme_toggle = document.querySelector('.theme_toggle');
let body = document.querySelector('body');
if (theme_toggle) {
    let cur_theme = localStorage.getItem('theme');
    if (cur_theme == 'light') {
        theme_toggle.classList.add('light');
        body.classList.add('light_theme');
    }
    theme_toggle.onclick = function() {
        theme_toggle.classList.toggle('light');
        body.classList.toggle('light_theme');
        if (theme_toggle.classList.contains('light')) {
            localStorage.setItem('theme', 'light');
        }
        else {
            localStorage.setItem('theme', 'dark');
        }
    }
}

setMask();
let form_blocks = document.querySelectorAll('.form_block');
if (form_blocks.length) {
    Array.prototype.forEach.call(form_blocks, function (block) {
        formSelect(block);
        var mutationObserver = new MutationObserver(function() {
            console.log('changed');
            setMask();
            formSelect(block);
            
        });
        mutationObserver.observe(block, {
          childList: true,
        });
    });
}
let repaymentBlock = document.querySelector('.js_repayment_block');
if (repaymentBlock) {
    repaymentChange();
    var mutationObserver = new MutationObserver(function() {
        repaymentChange();
    });
    mutationObserver.observe(repaymentBlock, {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: false,
      attributeOldValue: false,
      characterDataOldValue: false
    });
    function repaymentChange() {
        let repaymentForm = repaymentBlock.querySelector('form');
        if (repaymentForm) {
            let summInput = repaymentForm.querySelector('input[name=summ]');
            let comissionInput = repaymentForm.querySelector('input[name=comission]');
            let taxInput = repaymentForm.querySelector('input[name=tax]');
            if (summInput && comissionInput && taxInput) {
                summInput.oninput = function() {
                    let summValue = this.value;
                    let comissionValue = (summValue / 100 * 14).toFixed(2);
                    let taxValue = (summValue / 100 * 6).toFixed(2);
                    comissionInput.value = comissionValue;
                    taxInput.value = taxValue;
                }
            }
        }
    }
}
function setMask() {
    Inputmask({alias: "numeric", rightAlign: false, digits: 0 }).mask(document.querySelectorAll('input.numeric_input'));
    Inputmask({alias: "decimal", rightAlign: false, digits: 2 }).mask(document.querySelectorAll('input.decimal_input'));
    
    let todayFormated = formatDate();
    let dateInputs = document.querySelectorAll('input.date_input');
    if (dateInputs.length) {
        dateInputs.forEach(function(input){
            let inputValue = input.value;
            if (inputValue) {
                let valueFormated = formatDate(inputValue);
                input.value = valueFormated;
            }
            Inputmask({alias: "datetime", inputFormat: "dd.mm.yyyy", min: "01.01.1950", max: todayFormated}).mask(input);
        })
    }
    function formatDate(dateString) {
        var newDate = new Date();
        if (dateString) {
            newDate = new Date(dateString);
        }
        var dd = newDate.getDate();
        var mm = newDate.getMonth()+1; //January is 0!
        var yyyy = newDate.getFullYear();
        if(dd<10){ dd='0'+dd; };
        if(mm<10){ mm='0'+mm; };
        var dateFormated = dd+'.'+mm+'.'+yyyy;
        return dateFormated;
    }
}


    
export function formSelect(formBlock) {
  // formSubmit();
  // var mutationObserver = new MutationObserver(function() {
  //   formSubmit();
  // });
  // mutationObserver.observe(formBlock, {
  //   attributes: false,
  //   characterData: false,
  //   childList: true,
  //   subtree: false,
  //   attributeOldValue: false,
  //   characterDataOldValue: false
  // });
  // function formSubmit() {
    var form = formBlock.querySelector('form');
    if (form) {
        console.log(bbb);
        form.onsubmit = function(e) {
            e.preventDefault();
            let submitButton = form.querySelector('button[type=submit]');
            if (submitButton) {
              submitButton.setAttribute('disabled', 'disabled');
            }
            let dateInputs = form.querySelectorAll('input.date_input');
            if (dateInputs.length) {
              dateInputs.forEach(function(input){
                Inputmask.remove(input);
                const parts = input.value.split('.');
                console.log(parts);
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];
                let dateFormat = year + '-' + month + '-' + day;
                input.value = dateFormat;
                console.log(input.value);
              })
            }
            AJAXSubmit(form);
        }
    }
  // }
}
function ajaxSuccess () {
  var currentURL = window.location.href;
  if (this.responseURL === currentURL) {
    let response_block = this.response.documentElement.querySelector('.form_block');
    let changeBlock = document.querySelector('.form_block');
    changeBlock.innerHTML = response_block.innerHTML;
  }
  else {
    window.location.href = this.responseURL;
  }
}
function AJAXSubmit (oFormElement) {
  if (!oFormElement.action) { return; }
  var oReq = new XMLHttpRequest();
  oReq.onloadstart = function() {
    oReq.responseType = 'document';
  }
  oReq.onload = ajaxSuccess;
  if (oFormElement.method.toLowerCase() === "post") {
    oReq.open("post", oFormElement.action, true);
    oReq.send(new FormData(oFormElement));
  } else {
    var oField, sFieldType, nFile, sSearch = "";
    for (var nItem = 0; nItem < oFormElement.elements.length; nItem++) {
      oField = oFormElement.elements[nItem];
      if (!oField.hasAttribute("name")) { continue; }
      sFieldType = oField.nodeName.toUpperCase() === "INPUT" ? oField.getAttribute("type").toUpperCase() : "TEXT";
      if (sFieldType === "FILE") {
        for (nFile = 0; nFile < oField.files.length; sSearch += "&" + escape(oField.name) + "=" + escape(oField.files[nFile++].name));
      } else if ((sFieldType !== "RADIO" && sFieldType !== "CHECKBOX") || oField.checked) {
        sSearch += "&" + escape(oField.name) + "=" + escape(oField.value);
      }
    }
    oReq.open("get", oFormElement.action.replace(/(?:\?.*)?$/, sSearch.replace(/^&/, "?")), true);
    oReq.send(null);
  }
}
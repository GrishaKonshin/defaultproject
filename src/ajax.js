export function formSelect(formBlock) {
    var form = formBlock.querySelector('form');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            AJAXSubmit(form);
        }
    }
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
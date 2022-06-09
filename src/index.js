import {General} from "./util.js"

const titleContainer = document.getElementById("title");
const contentContainer = document.getElementById("content");

function init(){
    document.getElementById("write").addEventListener("click", writeEmailPage);
    document.getElementById("create").addEventListener("click", createTemplatePage);
    writeEmailPage();
}

function writeEmailPage(){
    clearPage();
    titleContainer.appendChild(General.textElement("h1", "Write an Email"));
    const templateFileInput = General.inputFile();

    titleContainer.appendChild(templateFileInput);
    templateFileInput.onchange = function(event){
        const reader = new FileReader();
        reader.onload = function(){
            console.log(reader.result);
            parseTemplateFileContent(reader.result);
        }
        reader.readAsText(templateFileInput.files[0]);
        console.log(templateFileInput.files[0]);
    }

}

function createTemplatePage(){
    clearPage();
    titleContainer.appendChild(General.textElement("h1", "Create a Template"));
    const templateNameInput = General.inputElement("Template Name");
    const templateSubjectLine = General.inputElement("Subject");
    const templateBodyInput = General.textAreaElement("Template Body");
    const createButton = General.buttonElement("Create");

    createButton.addEventListener("click", (e) =>{
        download(templateSubjectLine.value + "\n" + templateBodyInput.value, templateNameInput.value + ".tmpl", "text/plain");
    });

    contentContainer.appendChild(templateNameInput);
    contentContainer.appendChild(General.lineBreak());
    contentContainer.appendChild(templateSubjectLine);
    contentContainer.appendChild(General.lineBreak());
    contentContainer.appendChild(templateBodyInput);
    contentContainer.appendChild(General.lineBreak());
    contentContainer.appendChild(createButton);
    
    
}

function clearPage(){
    General.clearElement("title");
    General.clearElement("content");
}

function download(data, filename) {
    let type = "text/plain";
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function parseTemplateFileContent(templateContent){
    let lines = templateContent.split("\n");
    let itemList = [];
    let textInputList = [];
    const itemFormContainer = General.containerElement(["left"]);
    const emailPreviewContainer = General.containerElement(["right"]);

    
    for(let lineNum = 1; lineNum < lines.length; lineNum++){
        let line = lines[lineNum];
        let index = 0;
        while(line.indexOf("{", index) !== -1){
            let leftBracketIndex = line.indexOf("{", index);
            let rightBracketIndex = line.indexOf("}", index);
            if(rightBracketIndex == -1){
                break;
            }
            
            let itemName = line.substring(leftBracketIndex + 1, rightBracketIndex).trim();
            console.log("Item: " + itemName);
            if(!itemList.includes(itemName)){
                itemList.push(itemName);
            }
            index = rightBracketIndex + 1;
        }
    }
    contentContainer.appendChild(itemFormContainer);
    contentContainer.appendChild(emailPreviewContainer);

    itemFormContainer.appendChild(General.textElement("h5", "Text Fields"));

    for(let i = 0; i < itemList.length; i++){
        console.log("items[" + i + "] " + itemList[i]);
        textInputList[i] = General.inputElement(itemList[i]);
        itemFormContainer.appendChild(textInputList[i]);
        textInputList[i].onchange = function(event){
            updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList);
        }

    }

    updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList);
}

function updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList){
    while(emailPreviewContainer.firstChild){
        emailPreviewContainer.removeChild(emailPreviewContainer.firstChild);
    }
    for(let i = 0; i < textInputList.length; i++){
        if(!textInputList[i].value.trim().valueOf() == ""){
            templateContent = templateContent.replaceAll("{" + itemList[i] + "}", textInputList[i].value);
            
        }
    }
    let lines = templateContent.split("\n");
    emailPreviewContainer.appendChild(General.textElement("h6", lines[0]));

    for(let i = 1; i < lines.length; i++){
        emailPreviewContainer.appendChild(General.textElement("p", lines[i]));
    }

    

}
init();

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
            General.clearElement("content");
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
    const itemFormContainer = General.containerElement(["left_container"]);
    const emailPreviewContainer = General.containerElement(["right_container"]);

    
    for(let lineNum = 1; lineNum < lines.length; lineNum++){
        let line = lines[lineNum];
        let index = 0;
        while(line.indexOf("{", index) !== -1){
            let leftBracketIndex = line.indexOf("{", index);
            let rightBracketIndex = line.indexOf("}", index);
            if(rightBracketIndex === -1){
                break;
            }
            
            let itemName = line.substring(leftBracketIndex + 1, rightBracketIndex).trim();
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
        itemFormContainer.appendChild(General.lineBreak());
        let itemName = capitalize(itemList[i]);
        let label = General.textElement("h6", itemName);
        textInputList[i] = General.inputElement(itemName);
        itemFormContainer.appendChild(label);
        itemFormContainer.appendChild(textInputList[i]);
        
        textInputList[i].onchange = function(event){
            updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList);
        }

    }
    itemFormContainer.appendChild(General.lineBreak());
    let downloadButton = General.buttonElement("Download Email");
    itemFormContainer.appendChild(downloadButton);
    downloadButton.onclick = function(event){
        downloadEmailDraft(emailPreviewContainer);
    }

    updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList);
}

function capitalize(string){
    const notCapitalizedList = ["to", "an", "is", "a", "the", "as", "so", "than", "but", "that", "for", "till", "if", "when", "nor", "yet", "once", "or"];
    string = string.trim();
    //always capitalize first word
    let endIndex = string.indexOf(" ");
    if(endIndex === -1){
        endIndex = string.length;
    }
    let out = string.substring(0, 1).toUpperCase() + string.substring(1, endIndex);
    
    let index = string.indexOf(" ") + 1;
    while(index !== 0){ //while there are still other words left 
        let endIndex = string.indexOf(" ", index);
        if(endIndex === -1){
            endIndex = string.length;
        }
        let currentWord = string.substring(index, endIndex);
        out += " ";
        if(notCapitalizedList.includes(currentWord)){
            out += currentWord;
        }
        else{
            out += currentWord.substring(0, 1).toUpperCase() + currentWord.substring(1);
        }
        index = string.indexOf(" ", index) + 1;
    }
    return out;
}

function updateEmailPreview(emailPreviewContainer, templateContent, itemList, textInputList){
    console.log("updated");
    while(emailPreviewContainer.firstChild){
        emailPreviewContainer.removeChild(emailPreviewContainer.firstChild);
    }
    emailPreviewContainer.appendChild(General.textElement("h5", "Email Preview"));
    emailPreviewContainer.appendChild(General.lineBreak());
    for(let i = 0; i < textInputList.length; i++){
        console.log("Remaking elements");
        console.log("Text Input Value: " + textInputList[i].value);
        if(!(textInputList[i].value.trim().valueOf() === "")){
            console.log("Replacing " + itemList[i] + " with " + textInputList[i].value);
            templateContent = templateContent.replaceAll("{" + itemList[i] + "}", textInputList[i].value);
        }
    }
    let lines = templateContent.split("\n");
    emailPreviewContainer.appendChild(General.textElement("h6", lines[0]));

    for(let i = 1; i < lines.length; i++){
        emailPreviewContainer.appendChild(General.textElement("p", lines[i]));
    }
}

function downloadEmailDraft(emailPreviewContainer){
    let childElements = emailPreviewContainer.childNodes;
    let emailString = "Subject: ";
    for(let i = 0; i < childElements.length; i++){
        let currentElement = childElements[i];
        let tag = currentElement.tagName;
        if(tag.valueOf() === "P"){
            emailString = emailString + "<p>" + currentElement.textContent + "<p>\n";
            
        } else if(tag.valueOf() === "H6"){
            emailString = emailString + currentElement.textContent + "\nX-Unsent: 1\nContent-Type: text/html\n\n<html>\n<body>\n";
        }
        console.log(emailString);
    }
    emailString = emailString + "</body>\n</html>\n";
    download(emailString, "email.emltpl");
}
//download("Subject: Test EML message\nX-Unsent: 1\nContent-Type: text/html\n\n<html>\n<body>\nTest message with <b>bold</b> text.\n</body>\n</html>", "test.emltpl");
init();
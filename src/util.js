export class General{
    static getUpdateFunction(variable) {
        return (e) => {
            variable = e;
        }
    }

    static lineBreak() { 
        return document.createElement("br");
    }

    static textElement(tag, text){
        let parent = document.createElement(tag);
        let textElement = document.createTextNode(text);
        parent.appendChild(textElement);
        return parent;
    }

    static clearElement(id){
        var div = document.getElementById(id);
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }

    static containerElement(classList){
        let container = document.createElement("div");
        classList.forEach(className => container.classList.add(className));
        return container;
    }

    static inputElement(placeHolder){
        let input = document.createElement("input");
        input.classList.add("form-control");
        input.placeholder = placeHolder;
        return input;
    }

    static inputFile(){
        let input = document.createElement("input");
        input.type = "file";
        return input;

    }

    static textAreaElement(placeHolder){
        let textArea = document.createElement("textarea");
        textArea.classList.add("form-control");
        textArea.placeholder = placeHolder;
        textArea.rows = 30;
        return textArea;
    }

    static formElement(){
        let form = document.createElement("form");
        return form;
    }

    static buttonElement(text){
        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-outline-success");
        button.classList.add("my-2");
        button.classList.add("my-sm-0")
        button.textContent = text;
        button.style.marginTop="40px";
        return button;
    }
}

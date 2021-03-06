window.onload = function () {

    function getMonthName(month) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return monthNames[month]
    }

    function deleteAllChild() {//Delete all the saved notes which are currently in dom except header
        const obj2 = document.getElementById("showContent")
        const childElementsLength = obj2.childElementCount
        let i = 0
        while (i <= childElementsLength) {
            const lastChildObj2 = obj2.lastChild
            if (lastChildObj2.className !== "header") {
                obj2.removeChild(lastChildObj2);
            }
            i++
        }
        return
    }

    document.getElementById("save").onclick = function () {
        const key = document.getElementById("saveTitle").value
        const value = document.getElementById("saveDetails").value
        deleteAllChild()
        if (key.length !== 0 && value.length !== 0) {
            const jsonfile = {}
            const dateTime = new Date();
            const currDate = dateTime.getDate(), currMonth = getMonthName(dateTime.getMonth()), currYear = dateTime.getFullYear(), currHour = dateTime.getHours(), currMinute = dateTime.getMinutes()
            const dateString = currDate + " " + currMonth + " " + currYear + ", " + currHour + ":" + currMinute
            jsonfile[key] = { "value": value, "time": dateString }
            chrome.storage.local.set(jsonfile, function () {
            })
        }
        else {
            return;
        }
    }

    document.getElementById("viewSavedItem").onclick = function () {
        deleteAllChild()
        chrome.storage.local.get(null, function (items) {
            keyValueJson = JSON.parse(JSON.stringify(items));
            const obj1 = document.getElementById("submitForm")
            const obj2 = document.getElementById("showContent")

            for (let key in keyValueJson) {
                const value = keyValueJson[key]["value"].replace(/['"]+/g, '')
                const submittedTime = keyValueJson[key]["time"]
                
                const h3 = document.createElement("H3")
                const t3 = document.createTextNode(key)
                const h4 = document.createElement("P")
                const t4 = document.createTextNode(value)
                const copyButton = document.createElement('button');
                const h6 = document.createElement("P")
                const t6 = document.createTextNode(submittedTime)

                h6.setAttribute("class", "timeDisplay")
                h3.setAttribute("class", "contentTitle")
                h4.setAttribute("class", "contentDetails")
                copyButton.setAttribute("class", "copyButton")
                copyButton.innerHTML = "Copy";

                copyButton.onclick = function () {
                    const el = document.createElement("textarea")
                    el.value = value
                    document.body.appendChild(el)
                    el.select()
                    document.execCommand("copy")
                    document.body.removeChild(el)
                };

                const deleteButton = document.createElement("button")
                deleteButton.setAttribute("class", "deleteButton")
                deleteButton.innerHTML = "Delete";

                deleteButton.onclick = function () {
                    chrome.storage.local.remove(key)
                    h3.style.display = "none"
                    h6.style.display = "none"
                    h4.style.display = "none"
                };

                h3.appendChild(t3)
                h3.appendChild(copyButton)
                h3.appendChild(deleteButton)
                h6.appendChild(t6)
                h4.appendChild(t4)

                obj2.appendChild(h3)
                obj2.appendChild(h6)
                obj2.appendChild(h4)
            }

            obj2.style.display = "block"
            obj1.style.display = "none"
        });
    }

    document.getElementById("backButton").onclick = function () {
        const obj1 = document.getElementById("submitForm")
        const obj2 = document.getElementById("showContent")
        document.getElementById("saveTitle").value = ""
        document.getElementById("saveDetails").value = ""
        deleteAllChild()
        obj2.style.display = "none"
        obj1.style.display = "block"
    }
}

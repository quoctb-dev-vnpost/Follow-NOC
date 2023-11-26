const botToken = '6531753209:AAEv0yuwMdmAO9N8xKmcoDITvCM5BZ5jiTY';
const chatId = '-946486935';
const timeLine = 10;

function extractTableData() {
  var table = document.getElementById("table_sensortable");
  if (!table) {
    console.error("Table not found");
    return null; // Trả về null hoặc một giá trị mặc định nếu không tìm thấy bảng
  }

  // Kiểm tra xem trang web đã tương tác với người dùng chưa
  if (document.visibilityState !== "visible") {
    console.warn("Page is not visible. Skipping extraction.");
    return null;
  }

  var tbody = table.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");

  var extractedData = [];

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var rowData = [];

    for (var j = 0; j < cells.length; j++) {
      rowData.push(cells[j].innerText);
    }

    extractedData.push(rowData);
  }

  return extractedData;
}
// Sử dụng hàm extractTableData và in ra console hoặc thực hiện công việc tiếp theo
var tableData = extractTableData();

//Hàm sử dụng bot telegram để gửi cảnh báo
function sendMessage(botToken,chatId,messageText){
    var messageData = {
        chat_id: chatId,
        text: messageText
      };
      
      // Gửi tin nhắn sử dụng Fetch API
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messageData)
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

//Hàm check và đưa ra cảnh báo
const ipcheckcollowList = ['125','45','121','128','118','142','253','120','122','119','100','111']
function getInfoDevice() {
  for (var i = 0; i < tableData.length; i++) {
    const processDevicesName = tableData[i][0].split("\n")[1].toUpperCase()
    const processIPAdress = tableData[i][0].split("\n")[1].split("(")[1].split(")")[0]
    const iprange = processIPAdress.split(".")[2]
    const systemName = tableData[i][0].split("\n")[0].split(">>")
    const freeSpace  = Number(tableData[i][4].split(" ")[0])

    console.log("Dải IP tìm kiếm: ", iprange)
    if(ipcheckcollowList.includes(iprange) && freeSpace < 10){
        const messageDives = "[WARNNIG "+ systemName +"]\n" + "\n🔵 Device name: " + processDevicesName + "\n🟠 Sensor: " + tableData[i][1] + "\n🟡 Status: " + tableData[i][2] + "\n🟢 Message: " + tableData[i][3];
        console.log(messageDives)
        sendMessage(botToken,chatId,messageDives)
    }
  }
}
function reloadPageAfter5Seconds() {
    setTimeout(function () {
      location.reload(true); // Tham số true có nghĩa là tải lại trang và bỏ qua bộ nhớ cache
    }, timeLine*1000); // 5000 milliseconds = 5 seconds
  }
  
  // Gọi hàm để tải lại trang sau 5 giây
  reloadPageAfter5Seconds();
  getInfoDevice()
// Gửi message đến background script khi extension được kích hoạt
chrome.runtime.sendMessage({ action: "extensionActivated" });

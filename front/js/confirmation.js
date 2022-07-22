let orderID = new URLSearchParams(document.location.search).get("order");
document.getElementById("orderId").innerHTML = orderID;
// console.log(orderID);
orderID = undefined;
sessionStorage.clear();
localStorage.clear();

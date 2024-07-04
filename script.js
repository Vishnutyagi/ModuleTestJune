let data=[];
let filtereddata=[];

window.onload=async function(){
    await fetchdata();
    renderdata(data);
}

async function fetchdata(){
    await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
    .then(response=>{
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(response=>{
        data=response;
        filtereddata=[...data];
    })
    .catch(error=>{
        console.log("OOPs! Some error has occured: ",error);
    })
}
async function renderdata(data){
    const table=document.getElementById('mytable');
    table.innerHTML=`<tbody>
        ${data.map(temp => `
            <tr class="raw">
                <td>${temp.id}</td>
                <td><img alt="img" src="${temp.image}">${temp.name}</td>
                <td>${temp.symbol}</td>
                <td>$${temp.current_price}</td>
                <td>$${temp.total_volume}</td>
                <td id="price" style="color: ${temp.price_change_percentage_24h < 0 ? 'red' : 'green'}">${temp.price_change_percentage_24h}%</td>
                <td>Mkt Cap: $${temp.market_cap}</td>
            </tr>
        `
    ).join('')}
    </tbody>`
}

async function sortfunction(criteria){
    if(criteria=='percentage'){
        await filtereddata.sort((a,b)=>a.price_change_percentage_24h-b.price_change_percentage_24h);
    }
    else if(criteria=='mktcap'){
        await filtereddata.sort((a,b)=>a.market_cap-b.market_cap);
    }
    renderdata(filtereddata);
}
let area=document.getElementById('search');
// let count=0;
async function searching(){
    const searchTerm=area.value.toLowerCase();
    let x=filtereddata.filter((deta)=> deta.id.toLowerCase().includes(searchTerm) || deta.name.toLowerCase().includes(searchTerm))
    await renderdata(x);
    // console.log(filtereddata.length,count++);
}

function debouncing(callback,delay=1000){
    let timeid;
    return function(){
        let context=this;
        args=arguments;
        clearTimeout(timeid);
        timeid=setTimeout(()=>{
            callback.apply(this,args);
        },delay);
    }
}
const getter=debouncing(searching,1000);




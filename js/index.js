//=======Var===================================================
//begin
let $clean = document.querySelector('#clean')
let $myFIle = document.querySelector('#myFIle')
let $forContent = document.querySelector('#forContent')
let $newImgForm = document.querySelector('#newImgForm')
let $theGallery = document.querySelector('#theGallery')
let $chgImgForm = document.querySelector('#chgImgForm')
let $content = document.querySelector('#content_block')
let $nameNewFile = document.querySelector('#nameNewFile')
let $descNewFile = document.querySelector('#descNewFile')
let $showAddButton = document.querySelector('#showAddButton')
let $findByNameForm = document.querySelector('#findByNameForm')
let $inputChangeName = document.querySelector('#inputChangeName')
let $findByNameinput = document.querySelector('#findByNameinput')
let $findByNameButton = document.querySelector('#findByNameButton')
let $inputChangeDescript = document.querySelector('#inputChangeDescript')
let $theAdditionalInformation = document.querySelector('#theAdditionalInformation')
//end;
//======================IndexedDB==============================
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

if (!window.indexedDB)
  console.error('Ваш браузер не поддерживает indexedDB')
let request = indexedDB.open("gallery", 1)
let db

request.onerror = function(event) {
  console.log('Ошибка с IDB: ', event.target.errorCode)
}
request.onupgradeneeded = function(event){
  db = event.target.result
  let imagesStorage = db.createObjectStore('images', {keyPath: 'id', autoIncrement: true})
}
request.onsuccess = function(event) {
  db = event.target.result
  updateDisplay()
}
//============Скрытие и показ форм=========================================

function showChangeImages(id) { //Показать форму изменения
  $chgImgForm.style.display = 'block'
  document.querySelector('#chgImgFormlink').click()
}

let boolForNewImg = false
function showAddForm() { //Показать форму добавления
  if (!boolForNewImg) {
    resetTheFindForm()
    $newImgForm.style.display = 'block'
    $showAddButton.textContent = 'Отмена'
    $showAddButton.style.background = '#ccccff'
    boolForNewImg = true
  }
  else {
    $newImgForm.style.display = 'none'
    $showAddButton.textContent = 'Добавить'
    $showAddButton.style.background = ''
    $nameNewFile.value = ''
    $descNewFile.value = ''
    $myFIle.type = ''
    $myFIle.type = 'file'
    boolForNewImg = false
    updateDisplay()
  }
}

let boolForFind = false
function findByNameShowForm() { //Показать форму поиска
  if (!boolForFind) {
    resetTheNewImageForm()
    $findByNameForm.style.display = 'block'
    $findByNameButton.textContent = 'Отмена'
    $findByNameButton.style.background = '#ccccff'
    boolForFind = true
  }
  else {
    $findByNameForm.style.display = 'none'
    $findByNameButton.textContent = 'Найти по названию'
    $findByNameButton.style.background = ''
    $findByNameinput.value = ''
    boolForFind = false
    updateDisplay()
  }
}

    //Сброс форм
function resetTheNewImageForm() {
  $newImgForm.style.display = 'none'
  $showAddButton.textContent = 'Добавить'
  $showAddButton.style.background = ''
  $nameNewFile.value = ''
  $descNewFile.value = ''
  $myFIle.type = ''
  $myFIle.type = 'file'
  boolForNewImg = false
}
function resetTheChangeForm() {
  $inputChangeName.value = ''
  $inputChangeDescript.value = ''
  $chgImgForm.style.display = 'none'
}
function resetTheFindForm() {
  $findByNameForm.style.display = 'none'
  $findByNameButton.textContent = 'Найти по названию'
  $findByNameButton.style.background = ''
  $findByNameinput.value = ''
  boolForFind = false
  updateDisplay()
}

function showAdditionalInfo(itemID) { //Вывод доп. информации
  $theGallery.style.display = 'none'
  transactions('getObj', itemID, 'readonly')
  $theAdditionalInformation.style.display = 'block'
}
function backToTheGallery() { //Возврат к галерее
  $theGallery.style.display = 'block'
  $theAdditionalInformation.style.display = 'none'
  $forContent.innerHTML = ''
}
//=============Функции для запроса транзакций==========================
var url = window.URL || window.webkitURL;
const addImgForm = () => { //Вызов ф. добавление картины
  let $files = document.querySelector('#myFIle').files
  if ($files.length == 0) {alert('Файл не выбран'); resetTheNewImageForm()}
  for(let i = 0; i < $files.length; i++){
    let file = $files[i]
    let info, fileName, sizeW, sizeH, format, description,fileSize, date, x
    if (file.size >= 267386880) {  //ограничение на 255МБ
      alert('Файл слишком большой')
      resetTheNewImageForm()
      break
    }
    var img = new Image()
    img.onload = function () {
      sizeW = this.width; sizeH = this.height;
      //Для названия картины
      if (!$nameNewFile.value) {
        if (file.type.slice(6) == 'webp') { fileName = file.name.slice(0, -5) }
        else {  fileName = file.name.slice(0, -4) }
      }
      else {fileName = $nameNewFile.value}
      //Для высоты\ширины\формата
      if (sizeW > sizeH) { format = "Альбом"}
      else if (sizeW < sizeH) { format = "Портрет"}
      else { format = "Квадрат"}
      //Для описания картины
      description = $descNewFile.value ?  $descNewFile.value : '*Без описания*'
      //Для размера картины
      if ((file.size / 1024) > 1) {
        fileSize = file.size / 1024 //Становится КБ
        if ((fileSize / 1024) > 1) {
          x = (fileSize / 1024)
          fileSize = x.toFixed(2) + 'МБ' } //Становится МБ
        else {
          x = fileSize.toFixed(2)
          fileSize = x + 'КБ'  }

      }
      else {fileSize = file.size.toFixed(2) + 'Байт' }
      //Для размера картины
      date = file.lastModifiedDate.getDate() + '.' + file.lastModifiedDate.getMonth() + '.' + file.lastModifiedDate.getFullYear()
      formatObj = {
        format: format,
        sizeW: sizeW,
        sizeH:sizeH
      }
      info = {
        name: fileName,
        formatObj: formatObj,
        size: fileSize,
        mimetype: file.type.slice(6),
        date: date,
        description: description
      }
      var reader = new FileReader();
      reader.onload = (function() {
        let objImg = {link: reader.result, info: info}
        console.log('Новый объект: \n', objImg)
        transactions('add', objImg)

        resetTheNewImageForm()  // для сброса информации
      })
      reader.readAsDataURL(file);
    }
    img.src = url.createObjectURL(file)
  }
}
const formChangeImg = (id) => { //Вызов ф. изменения картины
  let newName, newDescrip, info, formatObj
  let newNameForChange = $inputChangeName.value
  let newDescripForChange = $inputChangeDescript.value

  if (!newNameForChange && !newDescripForChange) {
     alert('Файл не был изменен, поскольку не было введенно новых данных')
     resetTheChangeForm()
  }
  if (!newNameForChange) {  newName = objectForAddInfo.info.name }
  else {  newName = newNameForChange }
  if (!newDescripForChange) {  newDescrip = objectForAddInfo.info.description }
  else {  newDescrip = newDescripForChange }

  formatObj = {
    format: objectForAddInfo.info.formatObj.format,
    sizeW: objectForAddInfo.info.formatObj.sizeW,
    sizeH: objectForAddInfo.info.formatObj.sizeH
  }
  info = {
    name: newName,
    formatObj: formatObj,
    size: objectForAddInfo.info.size,
    mimetype: objectForAddInfo.info.mimetype,
    date: objectForAddInfo.info.date,
    description: newDescrip
  }
  objImgForChange = {link: objectForAddInfo.link, info: info, id: objectForAddInfo.id}
  transactions('change', objImgForChange)
  createAddInfo(objImgForChange)
  resetTheChangeForm()
}
const btnDelImages = (id) => {  //Вызов ф. удаление картины
  transactions('delete', id)
}
const cleanStorageForm = () => {  //Вызов ф. удаление картины
  transactions('clean')
}
function findByNameFunc() { //Поиск по имени
  updateDisplay($findByNameinput.value)
}
//============Транзакции=========================================
let objectForAddInfo = {} //Получения объекта для доп. информации

const transactions = (option, item = {}, readonly) => { //Шаблон для транзакций
  let valueForReadonly = !readonly ? 'readwrite' : 'readonly'
  let ts = db.transaction('images', valueForReadonly)
  let store = ts.objectStore('images')
  if (option == 'add') {
    let newImg = {link: item.link, info: item.info}
    store.add(newImg)
  }
  else if (option == 'change') {
    let changeImg = {link: item.link, info: item.info, id: item.id}
    store.put(changeImg)
  }
  if (option == 'getObj') {
    let req = store.get(item)
    req.onsuccess = (event) => {
      objectForAddInfo = event.target.result
      createAddInfo(objectForAddInfo)
      console.log('Объект для просмотра дополнительной информации: \n', objectForAddInfo)
    }
  }
  else if (option == 'delete') {
    const index = item
    let req = store.delete(index)
    req.onsuccess  = (event) => {
      $theAdditionalInformation.style.display = 'none'
      $theGallery.style.display = 'block'
    }
  }
  else if (option == 'clean') { store.clear(); }
  ts.oncomplete = (event) => { updateDisplay() }
  ts.onerror = function(event) {
    console.log('error with transaction: ', option)
  }
}

const updateDisplay = (findName) => { //Получение всей информации из Бд и передача на вывод
  let ts = db.transaction('images', 'readonly')
  let store = ts.objectStore('images')
  let req = store.openCursor()
  let allImages = []
  req.onsuccess = (event) => {
    let cursor = event.target.result;
    if (!findName) {
      if (cursor != null) {
        allImages.push(cursor.value);
        cursor.continue()
      } else {
        outptHtml(allImages);
        document.querySelector('#totalFiles').textContent = allImages.length
        navigator.storage.estimate().then(function(estimate) {
          let freeStorageSpace = estimate.usage / estimate.quota
          console.log('usage:', estimate.usage, 'quota:', estimate.quota, ' = ', (100 - freeStorageSpace) + '%')
          document.querySelector('#freeStorageSpace').textContent = Math.floor(100 - freeStorageSpace) + '%'
        })
      }
    }
    else {
      if (cursor != null) {
        if (cursor.value.info.name.includes(findName))
          allImages.push(cursor.value);
        cursor.continue()
      } else {  outptHtml(allImages)  }
    }
  }
  req.onerror = (event) => {
    console.log('error in cursor request ' + event.target.errorCode)
  }
  ts.oncomplete = () => { console.log('Updated') }
  ts.onerror = (event) => { console.log('error with transaction: update') }
}


//====== Для генерации карточек и доп. информации =====================
function outptHtml(allImages) {  //Вывод в html
  $content.innerHTML = '';
  allImages.forEach((item, i) => {
    let html = ''
    html = newImage(item, allImages[i].id)
    $content.insertAdjacentHTML('afterbegin', html)
  })
}
function newImage(item, itemID) { // Карточка
  let nameFile
  if (item.info.name.length > 17) { nameFile = item.info.name.slice(0, 17) + '...' }
  else {  nameFile = item.info.name }
  return `
  <div class="image">
    <img src="${item.link}">
    <p title = "Название">${nameFile}</p>
    <div class = "buttons inImages">
      <button id="showAdditionalInfo" onclick = "showAdditionalInfo(${itemID}); resetTheNewImageForm(); resetTheFindForm()">Просмотреть доп. информацию</button>
    </div>
  </div>
  `
}

function createAddInfo(objectForAddInfo){ //Доп. информация
  let html = `
    <div class="addtlInform">
      <div class="addtlInform__image">
        <img src="${objectForAddInfo.link}" title="${objectForAddInfo.info.name}">
      </div>
      <div class="addtlInform__title">
        <p>Дополнительная информация</p>
      </div>
      <div class="addtlInform__content">
        <div><p class = "for_p">Название картины:</p><p>${objectForAddInfo.info.name}</p></div>
        <div><p class = "for_p">Описание: </p><p class="da">${objectForAddInfo.info.description}</p></div>
        <div><p class = "for_p">Дата создания: </p><p>${objectForAddInfo.info.date}</p></div>
        <div>
          <p class = "for_p">Формат, выс/шир: </p>
          <p>${objectForAddInfo.info.formatObj.format}, ${objectForAddInfo.info.formatObj.sizeH}/${objectForAddInfo.info.formatObj.sizeW}</p>
        </div>
        <div>
          <p class = "for_p">Расширение файла: </p>
          <p>${objectForAddInfo.info.mimetype}</p>
        </div>
        <div>
          <p class = "for_p">Вес: </p>
          <p>${objectForAddInfo.info.size}</p>
        </div>
      </div>
      <div class = "buttons inAddInfo">
        <button onclick="backToTheGallery(); resetTheChangeForm()">Вернуться</button>
        <button onclick="showChangeImages(${objectForAddInfo.id})">Изменить<a id="chgImgFormlink" href="#chgImgForm"></a></button>
        <button id = "downloadButt"><a download = "${objectForAddInfo.info.name}" href="${objectForAddInfo.link}"></a>Скачать</button>
        <button onclick="btnDelImages(${objectForAddInfo.id}); resetTheChangeForm()">Удалить</button>
      </div>
    </div>
  `;
  $forContent.innerHTML = html

  let $downloadButt  = document.querySelector('#downloadButt')
  $downloadButt.addEventListener('click', function() {
    resetTheChangeForm()
    $downloadButt.children[0].click()
  })
}

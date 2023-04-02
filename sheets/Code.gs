const COURSE_NAME = 'Caledon Woods'

// This is a terrible name
// This is the starting row all the calculations take place with
// it is equal to where the first block of data exists in the systems page
// look at row 17
const START_ROW = 17

// Reference CELL for URL for debug importor (2022 historical - daily)
const URL_CELL = 'B33'

// Reference CELL for URL2 for debug imported (2022 historical - hourly)
const URL2_CELL = 'B34'

// Name of page for our sidebar (default)
const PAGE_SIDEBAR = 'Sidebar'

function onOpen() {
  buildMainMenu()  
}

// This creates our super cool menu at the top
// awesome right??
function buildMainMenu() {
  const ui = SpreadsheetApp.getUi();

  const menu = ui.createMenu(COURSE_NAME)  

  menu.addItem('Quickbar', 'showSidebar')  

  menu.addSeparator()  
  
  menu.addItem('3 Day forecast', 'goto_3day_forecast')

  menu.addSeparator()  

  menu.addItem('Weather', 'goto_weather')
  menu.addItem('GDD Tracker', 'goto_gdd_tracker')
  menu.addItem('Smith-Kerns Tracker', 'goto_smith_kerns_tracker' )
  menu.addItem('Growth Potential', 'goto_growth_potential')
  menu.addItem('Sand Growth Pot.', 'goto_sand_growth_potential')
  menu.addItem('Stimp', 'goto_stimp')
  menu.addItem('Greenspeed', 'goto_greenspeed')
  menu.addItem('Clip Volume', 'goto_clip_volume')     

  // Ship it!
  menu.addToUi()

  const debug_menu = ui.createMenu('Debug')

  const submenu_import = ui.createMenu('Historical Import')
    submenu_import.addItem("Import 2022 historical daily data", 'import2022historicalDailyData')
    submenu_import.addItem("Import 2022 historical hourly data", 'import2022historicalHourlyData')

    debug_menu.addSubMenu(submenu_import)    

    debug_menu.addSeparator()

    debug_menu.addItem('Calculate Humidity', 'calculateHumidity')

    debug_menu.addSeparator()

    debug_menu.addItem('Clear weather data', 'clearWeatherData')
    debug_menu.addItem('Clear data log', 'clearDataLog')
    
    debug_menu.addSeparator()

    debug_menu.addItem('Clear all data', 'clearAllData')

    debug_menu.addSeparator()

    debug_menu.addItem('Developer', 'showDeveloperSidebar')

    debug_menu.addItem('System', 'goto_system')    

  // Ship it!
  debug_menu.addToUi()    
}

// All hardcoded as of now
/////////////////////////////////////////////////////////////
/// QUICK MENU JUNK
/////////////////////////////////////////////////////////////

const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets()

// always first
const sheet_weather = sheets[0]

// in between junk
const sheet_gdd_tracker = sheets[1]
const sheet_smith_kerns_tracker = sheets[2]
const sheet_growth_potential = sheets[3]
const sheet_sand_growth_potential = sheets[4]
const sheet_stimp = sheets[5]
const sheet_greenspeed = sheets[6]
const sheet_clip_volume = sheets[8]
const sheet_3day_forecast = sheets[9]
const sheet_daily_log = sheets[10]
const sheet_data_log = sheets[11]

// always last
const sheet_system = sheets[sheets.length-1]

const goto_weather = _ => SpreadsheetApp.setActiveSheet(sheet_weather)
const goto_gdd_tracker = _ => SpreadsheetApp.setActiveSheet(sheet_gdd_tracker)
const goto_smith_kerns_tracker = _ => SpreadsheetApp.setActiveSheet(sheet_smith_kerns_tracker)
const goto_growth_potential = _ => SpreadsheetApp.setActiveSheet(sheet_growth_potential)
const goto_sand_growth_potential = _ => SpreadsheetApp.setActiveSheet(goto_sand_growth_potential)
const goto_stimp = _ => SpreadsheetApp.setActiveSheet(sheet_stimp)
const goto_greenspeed = _ => SpreadsheetApp.setActiveSheet(sheet_greenspeed)
const goto_clip_volume = _ => SpreadsheetApp.setActiveSheet(sheet_clip_volume)
const goto_3day_forecast = _ => SpreadsheetApp.setActiveSheet(sheet_3day_forecast)
const goto_daily_log = _ => SpreadsheetApp.setActiveSheet(sheet_3day_forecast)
const goto_system = _ => SpreadsheetApp.setActiveSheet(sheet_daily_log)

function showSidebar() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createTemplateFromFile(PAGE_SIDEBAR).evaluate();  
  html.setTitle(`${COURSE_NAME} Quickbar`)  
  ui.showSidebar(html);
}

function showDeveloperSidebar() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createTemplateFromFile('Developer').evaluate();  
  html.setTitle(`${COURSE_NAME} Developer`)  
  ui.showSidebar(html);
}


/////////////////////////////////////////////////////////////
// END
/////////////////////////////////////////////////////////////

// lol hahah lol
// this is awesome eh
// All this does is return two text ranges (eg A1:B5) that each month uses
// I can't figure out how to insert data without overrideing the formula
// so we just create two ranges, one for the two temps, then we skip
// the avg col, and create another range with the leftovers
// we return those.. 
// and also the row length now too
// and also the humidty_range for this range as well
function get_both_table_ranges_and_the_row_length(system_sheet, index) {
    const raw_start_col = system_sheet.getRange(`B${START_ROW+index}`).getValue()
    const start_col = String.fromCharCode(raw_start_col.charCodeAt(0) + 1)
    const start_row = system_sheet.getRange(`C${START_ROW+index}`).getValue()
    const row_length = system_sheet.getRange(`D${START_ROW+index}`).getValue()
    const end_row = (+start_row) + ((+row_length) - 1)
    const col_length = system_sheet.getRange(`E${START_ROW+index}`).getValue()
    const end_col = String.fromCharCode(raw_start_col.charCodeAt(0) + (+col_length))
    const temp_end_col = String.fromCharCode(raw_start_col.charCodeAt(0) + 2)
    const humdity_col = String.fromCharCode(raw_start_col.charCodeAt(0) + 6)
    const other_start_col = String.fromCharCode(raw_start_col.charCodeAt(0) + 4)
    const temp_start_range = `${start_col}${start_row}`
    const temp_end_range = `${temp_end_col}${end_row}`
    const other_start_range = `${other_start_col}${start_row}`
    const other_end_range = `${end_col}${end_row}`
    return {
      temperature:`${temp_start_range}:${temp_end_range}`,
      other:`${other_start_range}:${other_end_range}`,
      humdity:`${humdity_col}${start_row}:${humdity_col}${end_row}`,
      row_length:row_length,      
    }
}

function clearWeatherData() {
  // Clear em out boys
  
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets()  
  const weather_sheet = sheets[0]
  const system_sheet = sheets[sheets.length-1]

  toast('Clearing weather data, please wait..')

  for(let x=0;x<8; x++) {    

    // Generate the ranges we need to update
    const table_ranges = get_both_table_ranges_and_the_row_length(system_sheet, x)
    
    // Clear the contents of both ranges
    weather_sheet.getRange(table_ranges.temperature).clearContent()
    weather_sheet.getRange(table_ranges.other).clearContent()
  } 
  
  toast('Data cleared')
}

function clearDataLog() {

  const doc = SpreadsheetApp.getActiveSpreadsheet() 
  const datalog_sheet = doc.getSheetByName('Data Log')
  const range = datalog_sheet.getDataRange()
  range.clearContent()
}

function clearAllData() {

  toast('Clearing data, please wait..')

  clearWeatherData()
  clearDataLog()

  toast('Data cleared')
}

// Shows toast message to user
function toast(str) {

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(str)

  return 0
}


// Map all the API Weather codes
// TODO Hardcoded stuff again
// TODO NAAaAAAAAAAMES!
function generate_weathercodes_array_from_excel(system_sheet) {
  // start 42, end 66 (inclusive)
  const result = []
  const range = system_sheet.getRange('A42:B66')
  const values = range.getValues()  
  for(const v of values)
  {
    result[v[0]] = v[1]
  }
  return result
}

//---

// Import data
function import2022historicalDailyData(){

  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets()  

  const weather_sheet = sheets[0]
  const system_sheet = sheets[sheets.length-1]

  // TOOD - Figure out how to reference all these hardcoded things
  const url = system_sheet.getRange(URL_CELL).getValue()
  
  const response = UrlFetchApp.fetch(url)
  const content = response.getContentText();
  const data = JSON.parse(content)
    
  toast('Importing 2022 historical data, please wait..')  

  let data_index = 0

  const weathercodes = generate_weathercodes_array_from_excel(system_sheet)

  // TODO Not be hardcoded ?? 
  for(let x=0;x<8; x++) 
  {    
    const temperature_values = []
    const other_values = []    

    const table_ranges = get_both_table_ranges_and_the_row_length(system_sheet, x)        
    const row_length = table_ranges.row_length    

    for(let y=0;y<row_length;y++) {
      temperature_values.push(
        [
          data.daily.temperature_2m_max[data_index],
          data.daily.temperature_2m_min[data_index],
        ]
      ),      
      other_values.push(
        [
          data.daily.rain_sum[data_index],
          data.daily.precipitation_sum[data_index],
          null,
          data.daily.windspeed_10m_max[data_index],
          data.daily.et0_fao_evapotranspiration[data_index],
          weathercodes[data.daily.weathercode[data_index]],
        ]
      )          
      data_index++
    }

    // Set the values for both ranges
    weather_sheet.getRange(table_ranges.temperature).setValues(temperature_values)    
    weather_sheet.getRange(table_ranges.other).setValues(other_values)
  }  
  toast('Import complete')
}


function import2022historicalHourlyData() {
  
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets()  

  const datalog_sheet = sheets[sheets.length-2] // second last
  const system_sheet = sheets[sheets.length-1]  

  // TOOD - Figure out how to reference all these hardcoded things
  const url = system_sheet.getRange(URL2_CELL).getValue()
  
  const response = UrlFetchApp.fetch(url)
  const content = response.getContentText();
  const data = JSON.parse(content)

  //toast(Object.keys(data))

  toast('Importing 2022 hourly -- please wait -- will take some time')

  datalog_sheet.clearContents()

  //let index = 0
  const max_index = data.hourly.time.length  

  const insert_records = []  

  // add our header first

  const keys = Object.keys(data.hourly_units)
  const temp_a = []
  for(const key of keys) {
    temp_a.push(`${key} (${data.hourly_units[key]})`)
  }

  insert_records.push(temp_a)

  const weathercodes = generate_weathercodes_array_from_excel(system_sheet)
  const humidity_values = {}

  let b = false
  
  // Insert rest  
  for(let i=0;i < max_index; i++) {
    const new_date = new Date(+data.hourly.time[i] * 1000)    
    const month = new_date.getMonth()

    //toast(month)

    // If time is 3pm est, add the value as our daily humidity    
    if (new_date.getHours() == 15) {
      if (!humidity_values[month]) {
        humidity_values[month] = []
      }
      b = true      
      humidity_values[month].push([data.hourly.relativehumidity_2m[i]])
    }

    // Push data
    insert_records.push([
      new_date,
      data.hourly.temperature_2m[i],
      data.hourly.relativehumidity_2m[i],
      data.hourly.apparent_temperature[i],
      data.hourly.precipitation[i],
      data.hourly.rain[i],
      data.hourly.snowfall[i],
      weathercodes[data.hourly.weathercode[i]],
      data.hourly.windspeed_10m[i],
      data.hourly.winddirection_10m[i],
      data.hourly.et0_fao_evapotranspiration[i],
      data.hourly.soil_temperature_0_to_7cm[i],
      data.hourly.soil_moisture_0_to_7cm[i],      
    ])
    
  }

  const range = datalog_sheet.getRange(`A1:M${max_index+1}`)  

  range.setValues(insert_records)

//  const april_humidity = humidity_values[3]
//  const may_humidity = humidity_values[4]


//  const test_range = sheet_weather.getRange('G8:G37')
//  test_range.setValues([april_humidity, may_humidity])
  
  //toast(april_humidity[0].length)

  toast('Setting humidity values')

  const humidity_array = []
  for(let key of Object.keys(humidity_values)) 
  {
    humidity_array.push(humidity_values[key])
  }

  // TODO Not be hardcoded ?? 
  for(let x=0;x<8; x++) 
  {    
    const table_ranges = get_both_table_ranges_and_the_row_length(system_sheet, x)        
    const table_values = humidity_array[x]

    //toast(`${table_ranges.humdity} = ${table_values.length}`)
    //console.log(table_values)
    // Set the values for both ranges
    sheet_weather.getRange(table_ranges.humdity).setValues(table_values)
  }

  //toast('Importing complete')


}

function calculateHumidity()
{
  // First of april is record 2
  // 2pm is for that day
  toast('Not implemented')
  //const test = sheet_weather.getRange('A8')
  //const test = sheet_weather.getRange(8, 1)

  //toast(test.getValue())
}


// HTML TEMPLATE STUFF


function include_html_file(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};

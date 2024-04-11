import selenium
from selenium import webdriver 
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time 
import json 
  
  
if __name__ == "__main__": 
    options = webdriver.ChromeOptions() 
    # options.add_argument('--headless') 
    options.add_argument("--load-extension=.") 
   
    driver = webdriver.Chrome(options=options)
    driver.get("chrome://extensions")
    driver.switch_to.new_window('tab')
    driver.get("https://gsae.memberclicks.net") 
  
    time.sleep(5)  # make sure everything is loaded
    link = driver.find_elements(By.TAG_NAME, 'a') 
    links = []

    for i in link: 
        if(i.get_attribute('href') != None):
            links.append(i.get_attribute('href'))
    # print(links)
    with open("link.json", "w") as linkfile:
        json.dump(links, linkfile)

    for i in links: 
        print(i)
        driver.get(i)
        cookies = driver.get_cookies()
        for cookie in cookies:
            print(cookie['name'], cookie['domain'])
        logs = driver.get_log("browser") 
        # time.sleep(1)
        
    print("Quitting Selenium WebDriver") 
    driver.quit() 
  
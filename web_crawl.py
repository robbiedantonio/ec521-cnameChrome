import selenium
from selenium import webdriver 
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time 
import json 
import csv
  
  
if __name__ == "__main__": 
    file = open('head_1000.csv')
    reader = csv.reader(file)

    urls= []
    count = 0
    for row in reader: 
        if count != 0: 
            urls.append("http://" + row[2])
        count += 1

    options = webdriver.ChromeOptions() 
    options.add_argument('--headless') 
    options.add_argument("--load-extension=.") 
   
    driver = webdriver.Chrome(options=options)
    driver.get("chrome://extensions")
    driver.switch_to.new_window('tab')
    for i in range(len(urls)):
        try:
            print(i, urls[i])
            driver.get(urls[i]) 
        
            time.sleep(5)  # make sure everything is loaded
            link = driver.find_elements(By.TAG_NAME, 'a') 
            links = []

            for i in link: 
                if(i.get_attribute('href') != None):
                    links.append(i.get_attribute('href'))
            with open("link.json", "w") as linkfile:
                json.dump(links, linkfile)

            recent_domains = [None]*500
            found = False
            ind = 0

            with open("dm.txt", "a") as df:
                for i in links: 
                    driver.get(i)
                    cookies = driver.get_cookies()
                    for cookie in cookies:
                        if (cookie['httpOnly'] == False) and (cookie['secure'] == False):
                            # print(cookie['name'], cookie['domain'])
                            for i in range(len(recent_domains)): 
                                if (recent_domains[i] == cookie['domain']):
                                    found = True
                            if (found == False):
                                recent_domains[ind] = cookie['domain']
                                ind = (ind + 1)%500
                                df.write(cookie['domain'] + '\n')
                        found = False
                    logs = driver.get_log("browser") 
                    # time.sleep(1)
        except:
            pass
            
    print("Quitting Selenium WebDriver") 
    driver.quit() 
  
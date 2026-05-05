from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

def run_task_1():
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    
    try:
        driver.maximize_window()
        
        driver.get("https://demoqa.com/elements")
        time.sleep(2)

        element_id = driver.find_element(By.ID, "item-0")
        print(f"Найден элемент по ID. Текст этого элемента: '{element_id.text}'")

        css_1 = driver.find_element(By.CSS_SELECTOR, "div.element-list ul.menu-list > li#item-1")
        print(f"Найден элемент по составному CSS №1. Текст этого элемента: '{css_1.text}'")

        css_2 = driver.find_element(By.CSS_SELECTOR, "div.element-group div.header-wrapper .header-text")
        print(f"Найден элемент по составному CSS №2. Текст этого элемента: '{css_2.text}'")

        xpath_1 = driver.find_element(By.XPATH, "//li[contains(@class, 'btn-light') and descendant::span[text()='Web Tables']]")
        print(f"Найден элемент по составному XPath №1. Текст этого элемента: '{xpath_1.text}'")

        xpath_2 = driver.find_element(By.XPATH, "//div[contains(text(), 'Forms')]/ancestor::div[contains(@class, 'element-group')]//li[@id='item-0']")
        print(f"Найден элемент по составному XPath №2. Текст этого элемента: '{xpath_2.get_attribute('textContent')}'")

        driver.get("https://demoqa.com/links")
        time.sleep(2)

        partial_link = driver.find_element(By.PARTIAL_LINK_TEXT, "Bad Re")
        print(f"Найдена ссылка по частичному тексту ('Bad Re'). Полный текст: '{partial_link.text}'")

        list_of_links = driver.find_elements(By.TAG_NAME, "a")
        print(f"Найдено {len(list_of_links)} ссылок на странице.")
        print("Примеры текстов ссылок из списка:")
        for link in list_of_links[:3]:
            if link.text:
                print(f" - {link.text}")

    except Exception as e:
        print(f"Произошла ошибка: {e}")
    finally:
        driver.quit()
        
if __name__ == "__main__":
    run_task_1()
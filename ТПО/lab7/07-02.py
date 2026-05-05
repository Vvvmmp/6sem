import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    
    options.add_argument("--incognito")
    
    options.add_argument("--disable-save-password-bubble")
    
    options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    driver = webdriver.Chrome(
        service=ChromeService(ChromeDriverManager().install()),
        options=options
    )
    
    driver.implicitly_wait(10) 
    driver.maximize_window()
    
    yield driver
    driver.quit()

def login_to_saucedemo(driver):
    driver.get("https://www.saucedemo.com/")
    driver.find_element(By.ID, "user-name").send_keys("standard_user")
    driver.find_element(By.ID, "password").send_keys("secret_sauce")
    driver.find_element(By.ID, "login-button").click()

def test_authorization(driver):
    login_to_saucedemo(driver)
    title = driver.find_element(By.CLASS_NAME, "title").text
    assert title == "Products", f"Ожидалось 'Products', получено '{title}'"

def test_add_item_to_cart(driver):
    login_to_saucedemo(driver)
    driver.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    cart_badge = driver.find_element(By.CLASS_NAME, "shopping_cart_badge").text
    assert cart_badge == "1", "Товар не был добавлен в корзину"

def test_remove_item_from_cart(driver):
    login_to_saucedemo(driver)
    driver.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    driver.find_element(By.ID, "remove-sauce-labs-backpack").click()
    
    badges = driver.find_elements(By.CLASS_NAME, "shopping_cart_badge")
    assert len(badges) == 0, "Корзина не пуста после удаления товара"

def test_e2e_checkout_flow(driver):
    login_to_saucedemo(driver)
    
    driver.find_element(By.ID, "add-to-cart-sauce-labs-onesie").click()
    driver.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    
    driver.find_element(By.ID, "checkout").click()
    driver.find_element(By.ID, "first-name").send_keys("Test")
    driver.find_element(By.ID, "last-name").send_keys("User")
    driver.find_element(By.ID, "postal-code").send_keys("111111")
    
    time.sleep(0.5)
    driver.find_element(By.ID, "continue").click()
    
    wait = WebDriverWait(driver, 10)
    finish_button = wait.until(EC.element_to_be_clickable((By.ID, "finish")))
    finish_button.click()
    
    complete_text = driver.find_element(By.CLASS_NAME, "complete-header").text
    assert complete_text == "Thank you for your order!", "Заказ не был успешно завершен"

def test_radio_button_selection(driver):
    driver.get("https://demoqa.com/radio-button")
    
    wait = WebDriverWait(driver, 10)
    yes_label = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "label[for='yesRadio']")))
    yes_label.click()
    
    success_msg = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "text-success")))
    assert success_msg.text == "Yes", f"Ожидалось 'Yes', получено '{success_msg.text}'"
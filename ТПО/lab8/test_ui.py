import pytest
import time
import json
from pages import LoginPage, InventoryPage

@pytest.mark.auth
@pytest.mark.smoke
@pytest.mark.run(order=1)
@pytest.mark.parametrize("username, password", [
    ("standard_user", "secret_sauce"),
    ("problem_user", "secret_sauce")
])
def test_authorization_and_cookies(driver, username, password):
    login_page = LoginPage(driver)
    inventory_page = InventoryPage(driver)
    
    login_page.open()
    login_page.login(username, password)
    
    assert inventory_page.get_title_text() == "Products"
    
    cookies = driver.get_cookies()
    print(f"\n[INFO] Куки для пользователя {username}: {cookies}")
    with open(f"cookies_{username}.json", "w") as file:
        json.dump(cookies, file)


@pytest.mark.smoke
@pytest.mark.run(order=2)
def test_add_and_remove_item_from_cart(driver):
    login_page = LoginPage(driver)
    inventory_page = InventoryPage(driver)
    
    login_page.open()
    login_page.login("standard_user", "secret_sauce")
    
    inventory_page.add_backpack_to_cart()
    assert inventory_page.get_cart_badge_text() == "1", "Товар не добавлен"
    
    driver.save_screenshot("cart_with_item.png")
    
    inventory_page.remove_backpack_from_cart()
    assert inventory_page.get_cart_badge_text() is None, "Корзина не пуста!"


@pytest.mark.auth
@pytest.mark.xfail(reason="Неправильный пароль")
def test_failed_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    login_page.login("standard_user", "wrong_password")
    
    inventory_page = InventoryPage(driver)
    assert inventory_page.get_title_text() == "Products"


@pytest.mark.skip(reason="Скипаем")
def test_checkout_flow(driver):
    pass 


#python -m pytest test_ui.py --html=report.html --self-contained-html
#python -m pytest test_ui.py -m auth -v
#python -m pytest test_ui.py -m "not smoke" -v
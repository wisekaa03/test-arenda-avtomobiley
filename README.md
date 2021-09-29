- Запустить yarn
- Скопировать .env.example в .env
- Запустить yarn docker
- Запустить yarn start
- Зайдите на http://localhost:3000/graphql
- В окне:
  * Вывод всех автомобилей
    ```
    {
      listCars {
        id
        brand
        model
        licenseplate
        vin
      }
    }
    ```

  * Произвести расчёт стоимости аренды автомобиля за период
    ```
    {
      calculateLease(
        rent: {
          car: { id: 4 }
          tariff: first
          start_date: "2021-09-27"
          end_date: "2021-10-07"
        }
      ) {
        car {
          id
          brand
          model
          licenseplate
          vin
        }
        start_date
        end_date
        price
      }
    }
    ```

  * Вывод всех сессий аренды
    ```
    {
      listRental(start_date: "2021-09-01", end_date: "2021-09-31") {
        id
        car {
          id
          brand
          model
          licenseplate
          vin
        }
        tariff
        start_date
        end_date
        price
      }
    }
    ```

  * Создание сессии аренды автомобиля
    ```
    mutation {
      bookCarRental(
        rent: {
          car: { id: 3 }
          tariff: first
          start_date: "2021-09-01"
          end_date: "2021-09-01"
        }
      ) {
        id
        car {
          id
          brand
          model
          licenseplate
          vin
        }
        tariff
        start_date
        end_date
        price
      }
    }
    ```

  * Сформировать отчёт средней загрузки автомобилей по дням, по каждому авто и по всем автомобилям.
    ```
    mutation {
      statistics(statistics:{by:day,start_date:"2021-09-01",end_date:"2021-09-31"}) {
        ... on StatisticsByDay {
          date
          car_id
        }
      }
    }
    ```
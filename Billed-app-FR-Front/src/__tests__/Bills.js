/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from '../__mocks__/store'
import router from "../app/Router.js";
import store from '../app/store'
import { formatDate, formatStatus } from "../app/format.js"

const setLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
} 
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })

    test("Then the Bills page should be rendered", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy()
      const table = document.getElementsByTagName("table")
      const tbody = document.querySelector("[data-testid='tbody']");
      expect(tbody.querySelectorAll('tr').length).not.toBe(0)
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = [...dates].sort((a, b) => (new Date(b.date) - new Date(a.date)))
      expect(dates).toEqual(datesSorted)
    })
  })

  describe('when I click on the icon eye', () => {
    test('Then it open a modal', () => {
      const testBill = new Bills({ document, onNavigate, store: mockStore, localStorage: window.localStorageMock })
      $.fn.modal = jest.fn();
      const eyeIcons = screen.getAllByTestId('icon-eye')
      expect(eyeIcons).toBeTruthy()
      const eyeIcon = eyeIcons[0]

      const handleClickIconEye = jest.fn(testBill.handleClickIconEye)
      eyeIcon.addEventListener('click', () => handleClickIconEye(eyeIcon))
      userEvent.click(eyeIcon)
    })
  })

  describe('when I click on the new bill button', () => {
    test('Then it go to the new bill page', () => {
      setLocalStorageMock();
      document.body.innerHTML = BillsUI(bills[0])
      const testBills = new Bills({document, onNavigate, store: null, localStorage: window.localStorage})

      const newBillButton = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn((e) => testBills.handleClickNewBill(e))
      const getBill = jest.fn((e) => testBills.getBills())

      newBillButton.addEventListener('click', handleClickNewBill)
      fireEvent.click(newBillButton)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })

  describe('when I access to the bill page', () => {

    test('Then Bills data are retrieved', async () => {
      setLocalStorageMock();
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()

      const bill = bills[0]
      expect(screen.getAllByText(bill.type)).toBeTruthy()
      expect(screen.getByText(bill.name)).toBeTruthy()
      expect(screen.getByText(`${bill.amount} €`)).toBeTruthy()
      expect(screen.getByText(formatStatus(bill.status))).toBeTruthy()
      expect(screen.getByText(formatDate(bill.date))).toBeTruthy()
    })
    describe('when the retrieve data fail', () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        setLocalStorageMock();

        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test('Then i get an error 404', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()       

      })
      test('Then i get an error 500', async() => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()   
      })
  
    })
    describe('when I access to the bill page', () => {
      test('Then return an unformated date', async() => {
        const badBill  = (await mockStore.bills().list())[0]
        badBill.date = "2002-02-02"
        const bill = { list: () =>  Promise.resolve([badBill]) }
        mockStore.bills.mockImplementationOnce(() => bill)

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        expect(screen.findAllByText('2002-02-02')).toBeTruthy
      })

    })

  })
})

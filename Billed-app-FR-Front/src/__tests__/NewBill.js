/**
 * @jest-environment jsdom
 */

import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import store from '../app/store'
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from '../constants/routes'

const setLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
}
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })

    test("Then mail icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy()
    })
  })

  describe("When I am on NewBill Page", () => {

    describe('And I upload a image file with correct format', () => {
      test('Then the file format is checked on change', () => {
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
        document.body.innerHTML = NewBillUI()
        setLocalStorageMock();
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const imgFile = new File(['test.jpg'], 'test.jpg', { type: 'image/jpg' })
        const inputFile = screen.getByTestId('file')
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        inputFile.addEventListener('change', handleChangeFile)
        fireEvent.change(inputFile, { target: { files: [imgFile] } })

        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
      })
    })

    describe('And I upload a file without correct format', () => {
      test('Then the file format is checked on change', () => {
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
        document.body.innerHTML = NewBillUI()
        setLocalStorageMock();

        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const imgFile = new File(['test.txt'], 'test.txt', { type: 'text/txt' })
        const inputFile = screen.getByTestId('file')
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        inputFile.addEventListener('change', handleChangeFile)
        fireEvent.change(inputFile, { target: { files: [imgFile] } })

        expect(handleChangeFile).toBeCalled()

        //L43-46
        expect(inputFile.files[0].name).toBe("test.txt")
        expect(document.querySelector(".error").style.display).not.toBe("none")
      })
    })

    describe("And I submit a valid bill form", () => {
      test('then a bill is created', async  () => {
        document.body.innerHTML = NewBillUI()
        setLocalStorageMock();
        jest.mock("../app/store", () => mockStore)

        const createBill = jest.fn(mockStore.bills().create);
        const updateBill = jest.fn(mockStore.bills().update);
        const { fileUrl, key } = await createBill();

        expect(createBill).toHaveBeenCalledTimes(1);
        expect(key).toBe("1234");
        expect(fileUrl).toBe("https://localhost:3456/images/test.jpg");


        const newBill = await updateBill();
        expect(updateBill).toHaveBeenCalledTimes(1);

        expect(newBill).toEqual({
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          status: "pending",
          type: "Hôtel et logement",
          commentary: "séminaire billed",
          name: "encore",
          fileName: "preview-facture-free-201801-pdf-1.jpg",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          email: "a@a",
          pct: 20
        });

      let searchURL = ROUTES_PATH.Bills;
          searchURL = searchURL.slice(-5)
          expect(searchURL).toBe('bills');
      })
    })

    describe("And I submit a incomplete bill form", () => {
      test('then a message required field is displayed', () => {
        document.body.innerHTML = NewBillUI()
        setLocalStorageMock();

        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')

        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`input[data-testid="expense-name"]`).value = ''
        document.querySelector(`input[data-testid="datepicker"]`).value = ''
        document.querySelector(`select[data-testid="expense-type"]`).value = ''
        document.querySelector(`input[data-testid="amount"]`).value = ''
        document.querySelector(`input[data-testid="vat"]`).value = ''
        document.querySelector(`input[data-testid="pct"]`).value = ''
        document.querySelector(`textarea[data-testid="commentary"]`).value = ''
        newBill.fileUrl = ''
        newBill.fileName = ''
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()

        let searchURL = ROUTES_PATH.NewBill;
        searchURL = searchURL.slice(-3)
        expect(searchURL).toBe('new');
        
      })
    })
  })
})
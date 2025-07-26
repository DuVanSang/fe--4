import { BaseCrudService, TBaseResponse } from "@/base/base-crud-service";
// import { IPaginatedItems } from "@/base/base.model";
import { httpService } from "@/base/http-service";


class BooksClientService extends BaseCrudService {
    constructor() {
        super('/books');
    }

    public async createBookLoan(data: any): Promise<any> {
    try {
        const res = await httpService.request<TBaseResponse<any>>({
            method: 'POST',
            url: '/book-loans/RequestBorrow',
            data,
        });
        return res.result;
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error('Số lượng sách trong kho không còn.');
        }
        // Nếu không phải lỗi 400, ném ra lỗi gốc
        throw error;
    }
}



}

const booksClientService = new BooksClientService();

export default booksClientService;

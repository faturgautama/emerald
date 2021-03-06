import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request/http-request.service';
import { UtilityService } from '../utility/utility.service';
import * as API_CONFIG from '../../api';
import { Observable } from 'rxjs';
import { GetAllAdmisiPasienModel, ISaveAdmisiPasienModel, PostSaveAdmisiPasienModel } from 'src/app/model/pelayanan-pasien.model';
import { GetRiwayatPelayananPasienModel } from 'src/app/model/riwayat-pelayanan.model';
import { FilterModel } from 'src/app/components/navigation/filter/filter.component';

@Injectable({
    providedIn: 'root'
})
export class PelayananPasienService {

    API = API_CONFIG.API.PELAYANAN_PASIEN;

    constructor(
        private utilityService: UtilityService,
        private httpRequestService: HttpRequestService,
    ) { }

    onGetAllAdmisiPasienByDynamicFilter(body: any): Observable<GetAllAdmisiPasienModel> {
        return this.httpRequestService.defaultPostRequest(this.API.GET_ALL_ADMISI_BY_DYNAMIC_FILTER, body);
    }

    onGetPasienForLookupAdmisi(body: any): Observable<GetAllAdmisiPasienModel> {
        return this.httpRequestService.defaultPostRequest(this.API.LOOKUP_PERSON_FOR_ADMISI, body);
    }

    onSaveAdmisiPasien(body: ISaveAdmisiPasienModel): Observable<PostSaveAdmisiPasienModel> {
        return this.httpRequestService.defaultPostRequest(this.API.SAVE_ADMISI, body);
    }

    onGetRiwayatAdmisiPasienByDynamicFilter(body: any): Observable<GetRiwayatPelayananPasienModel> {
        return this.httpRequestService.defaultPostRequest(this.API.GET_RIWAYAT_ADMISI_BY_DYNAMIC_FILTER, body);
    }
}

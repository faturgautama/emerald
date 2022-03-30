import * as AUTHENTICATION from './AUTHENTICATION';
import * as SETUP_DATA from './SETUP_DATA';
import * as PENDAFTARAN_PASIEN from './PENDAFTARAN_PASIEN';
import * as PELAYANAN_PASIEN from './PELAYANAN_PASIEN';
import * as TREATMENT from './TREATMENT';

export const API = Object.assign({}, {
    AUTHENTICATION: AUTHENTICATION,
    SETUP_DATA: SETUP_DATA,
    PENDAFTARAN_PASIEN: PENDAFTARAN_PASIEN,
    PELAYANAN_PASIEN: PELAYANAN_PASIEN,
    TREATMENT: TREATMENT,
})
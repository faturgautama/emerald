import { formatCurrency } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActionButtonModel } from 'src/app/components/navigation/action-button/action-button.component';
import { FilterDialogComponent, FilterDialogProp } from 'src/app/components/navigation/filter-dialog/filter-dialog.component';
import { IGetAdmisiPasienModel, IGetPersonForLookupAdmisiModel } from 'src/app/model/pelayanan-pasien.model';
import { IPersonDokterModel, ISetupDokterModel } from 'src/app/model/setup-dokter.model';
import { ISetupTarifModel } from 'src/app/model/setup-tarif.model';
import { PelayananPasienService } from 'src/app/services/pelayanan-pasien/pelayanan-pasien.service';
import { SetupDokterService } from 'src/app/services/setup-dokter/setup-dokter.service';
import { SetupTarifService } from 'src/app/services/setup-tarif/setup-tarif.service';
import { TreatmentService } from 'src/app/services/treatment/treatment.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as API_CONFIG from '../../api';

@Component({
    selector: 'app-treatment',
    templateUrl: './treatment.component.html',
    styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit {

    API = API_CONFIG.API;

    ActionButton: ActionButtonModel[] = [
        {
            id: 'add', icon: 'fas fa-plus', caption: 'Add Treatment'
        },
        {
            id: 'delete', icon: 'fas fa-trash', caption: 'Delete Treatment'
        },
        {
            id: 'save', icon: 'fas fa-save', caption: 'Save Treatment'
        },
    ];

    @ViewChild('FilterDialogPasien') FilterDialogPasien!: FilterDialogComponent;
    FilterDialogProp!: FilterDialogProp;
    SelectedIdRegister: number = 0;

    ListTreatment: any[] = [];
    SelectedListTreatment: any;
    SelectedListTreatmentIndex: number = 0;

    modalRef?: BsModalRef;
    @ViewChild('ModalInsertUpdateTarif') ModalInsertUpdateTarif!: TemplateRef<any>;

    FormInsertUpdateTarif!: FormGroup;

    DropdownTarifDatasource: ISetupTarifModel[] = [];
    DropdownTarifField: Object = { text: 'nama_setup_tarif', value: 'id_setup_tarif' };

    DropdownDokterDatasource: IPersonDokterModel[] = [];
    DropdownDokterField: Object = { text: 'full_name', value: 'id_dokter' };

    constructor(
        private formBuilder: FormBuilder,
        private bsModalService: BsModalService,
        private utilityService: UtilityService,
        private treatmentService: TreatmentService,
        private setupTarifService: SetupTarifService,
        private setupDokterService: SetupDokterService,
        private pelayananPasienService: PelayananPasienService,
    ) { }

    ngOnInit(): void {
        this.FilterDialogProp = {
            title: 'Pencarian Pasien',
            dynamicFilter: {
                columnName: `concat(per.nama_depan, ' ',per.nama_belakang)`,
                filter: 'like',
                searchText: '',
                searchText2: ''
            },
            searchUrl: this.API.PELAYANAN_PASIEN.GET_ALL_ADMISI_BY_DYNAMIC_FILTER,
            searchResultAttribute: {
                id: 'nama_pasien',
                text: 'no_rekam_medis'
            }
        };

        this.FormInsertUpdateTarif = this.formBuilder.group({
            id_setup_tarif: [0, [Validators.required]],
            nama_setup_tarif: ["", []],
            nominal_tarif: [0, []],
            id_dokter: [0, [Validators.required]],
            nama_dokter: ['', []],
            qty: [1, []]
        });

        this.setupTarifService.onGetAllByDynamicFilter([])
            .subscribe((result) => {
                this.DropdownTarifDatasource = result.data;
            });

        this.setupDokterService.onGetAllPersonDokterByDynamicFilter([])
            .subscribe((result) => {
                this.DropdownDokterDatasource = result.data;
            });
    }

    handleClickActionButton(button: ActionButtonModel): void {
        switch (button.id) {
            case 'add':
                this.handleOpenModalInsertUpdateTarif();
                break;
            case 'delete':
                this.onDeleteTarif(this.SelectedListTreatmentIndex);
                break;
            case 'save':
                this.onSubmitTreatment(this.SelectedIdRegister, this.ListTreatment);
                break;
            default:
                break;
        }
    }

    handleChooseFilterDialogPasien(args: IGetAdmisiPasienModel): void {
        this.SelectedIdRegister = args.id_register;

        const nama_pasien = document.getElementById('nama_pasien') as HTMLInputElement;
        nama_pasien.value = args.nama_pasien;

        const no_rekam_medis = document.getElementById('no_rekam_medis') as HTMLInputElement;
        no_rekam_medis.value = args.no_rekam_medis;

        const umur = document.getElementById('umur') as HTMLInputElement;
        umur.value = args.umur;
    }

    handleOpenModalInsertUpdateTarif(): void {
        this.modalRef = this.bsModalService.show(this.ModalInsertUpdateTarif, {
            backdrop: 'static'
        });

        this.onResetForm();
    }

    handleChangeDropdownTarif(args: any): void {
        const itemData = args.itemData;

        this.nama_setup_tarif.setValue(itemData.nama_setup_tarif);
        this.nominal_tarif.setValue(formatCurrency(itemData.nominal_tarif, 'EN', 'Rp. '));
        this.qty.setValue(1);
    }

    handleChangeDropdownDokter(args: any): void {
        const itemData = args.itemData;

        this.nama_dokter.setValue(itemData.full_name);
    }

    handleClickListTreatment(item: any, index: number): void {
        this.SelectedListTreatment = item;

        this.SelectedListTreatmentIndex = index;

        const elem = document.getElementById('cardListTreatment' + index) as HTMLElement;

        this.ListTreatment.forEach((item, i) => {
            const el = document.getElementById('cardListTreatment' + i) as HTMLElement;

            if (i != index) {
                if (el.classList.contains('treatmentSelected')) {
                    el.classList.remove('treatmentSelected');
                }
            } else {
                elem.classList.add('treatmentSelected')
            }
        });
    }

    onSaveInsertUpdateTarif(FormInsertUpdateTarif: any): void {
        this.ListTreatment.push(FormInsertUpdateTarif);

        this.modalRef?.hide();
    }

    onDeleteTarif(index: any): void {
        this.ListTreatment.splice(index, 1);
    }

    onResetForm(): void {
        this.FormInsertUpdateTarif.reset();
        this.id_setup_tarif.setValue(0);
        this.nama_setup_tarif.setValue('');
        this.nominal_tarif.setValue(0);
        this.id_dokter.setValue(0);
        this.nama_dokter.setValue('');
        this.qty.setValue(1);
    }

    onSubmitTreatment(id_register: number, item_transaksi: any): void {
        this.treatmentService.onPostSave({ id_register: id_register, item_transaksi: item_transaksi })
            .subscribe((result) => {
                if (result.responseResult) {
                    this.utilityService.onShowCustomAlert('success', 'Success', 'Treatment Berhasil Disimpan')
                        .then(() => {
                            this.SelectedIdRegister = 0;
                            this.ListTreatment = [];
                            this.SelectedListTreatment = 0;
                            this.SelectedListTreatmentIndex = 0;

                            const nama_pasien = document.getElementById('nama_pasien') as HTMLInputElement;
                            nama_pasien.value = "";

                            const no_rekam_medis = document.getElementById('no_rekam_medis') as HTMLInputElement;
                            no_rekam_medis.value = "";

                            const umur = document.getElementById('umur') as HTMLInputElement;
                            umur.value = "";
                        });
                };
            })
    }

    get id_setup_tarif(): AbstractControl { return this.FormInsertUpdateTarif.get('id_setup_tarif') as AbstractControl };
    get nama_setup_tarif(): AbstractControl { return this.FormInsertUpdateTarif.get('nama_setup_tarif') as AbstractControl };
    get nominal_tarif(): AbstractControl { return this.FormInsertUpdateTarif.get('nominal_tarif') as AbstractControl };
    get id_dokter(): AbstractControl { return this.FormInsertUpdateTarif.get('id_dokter') as AbstractControl };
    get nama_dokter(): AbstractControl { return this.FormInsertUpdateTarif.get('nama_dokter') as AbstractControl };
    get qty(): AbstractControl { return this.FormInsertUpdateTarif.get('qty') as AbstractControl };
}
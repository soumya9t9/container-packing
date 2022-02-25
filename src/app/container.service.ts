import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: "root"
})
export class ContainerService {
    constructor(private http:HttpClient) {}
    getPackagingSample(item:any) {
        return this.http.get(`assets/data/packagingsample.json`)
    }
}
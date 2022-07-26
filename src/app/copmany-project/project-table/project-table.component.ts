import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Subscription,of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { uniq } from 'lodash';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Company } from '../company.model';
import { Project } from '../project.model';
import { Task } from '../task.model';
import { Record } from '../record.model';
import { UIService } from 'src/app/shared/ui.service';
import { CompanyProjectService } from '../companyProject.service';
import { MyCustomPaginatorIntl } from './myCustomPaginatorIntl';


@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }
  ]
})
export class ProjectTableComponent implements OnInit,AfterViewInit,OnDestroy {
  constructor(
    private comProServic: CompanyProjectService,
    private db:AngularFirestore,
    private uiService: UIService,
    ) {}

  displayedColumns = ['companyName', 'projectName', 'taskName', 'estimatedTime', 'action'];
  companyDataSource = new MatTableDataSource<Company>();
  projectDataSource = new MatTableDataSource<Project>();
  isLoading = false;
  private companiesSubscription: Subscription;
  private dataSubscription: Subscription;
  private loadingSubscription: Subscription

  @ViewChild(MatSort,{static: false}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  companies: Company[];
  projects: Project[];
  tasks: Task[];

  dataSource = new MatTableDataSource<any>();
  //////////////////////////////////////
  showSeparate: boolean;
  showSameTime: boolean;

  companies$: Observable<Company[]>;
  projects$: Observable<Project[]>;

  all$: Observable<{companies: Company[]; projects: Project[]}>;

  joined$: Observable<any>;

  ////////////////////////////////////////



  ngOnInit() {

    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    
    this.companiesSubscription = this.comProServic.companiesChanged
    .subscribe((companies: Company[]) => {
      this.companies = companies;
    });

    // this.projectsSubscription = this.comProServic.projectsChanged
    // .subscribe((projects: Project[]) => {
    //   this.projectDataSource.data = projects;
    //   console.log(projects)
    // })

    ///////////////////connect project and company
    // this.db
    // .collection<any>('project')
    // .valueChanges()
    // .pipe(
    //   switchMap( projects =>{
    //     const companyIds = uniq(projects.map(pro => pro.companyId));
    //     console.log(companyIds)

    //     return  combineLatest([
    //       of(projects),
            
    //       combineLatest(
    //       companyIds.map(companyId =>
    //        this.db.collection<any>('company', ref => ref.where('id', '==', companyId))
    //        .valueChanges().pipe(
    //          map(companies => companies[0]
    //            )
    //        )
    //        )
    //    )
    //     ])
    //   }), 
    //   map(([projects, companies]) =>{
    //     return projects.map(project => {
    //       return {
    //         ...project,
    //         company: companies.find( a =>a.id === project.companyId)
    //       }
    //     })
    //   }

    //   )   
    // )
    // .subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log(data);
    // })
/// ---------------- record + task + project
    // this.db
    // .collection<Record>('record')
    // .valueChanges()
    // .pipe(
    //   switchMap( records =>{
    //     const taskIds = uniq(records.map(pro => pro.taskId));
    //     const projectIds = uniq(records.map(pro => pro.projectId));
    //     console.log(projectIds);
    //     console.log(taskIds);

    //     return  combineLatest(
    //       [
    //         of(records),  

    //         combineLatest(
    //          taskIds.map(taskId =>
    //          this.db.collection<Task>('task', ref => ref.where('id', '==', taskId))
    //          .valueChanges().pipe(
    //            map(tasks => tasks[0]
    //              )
    //          )
    //          )
    //      ),

    //      combineLatest( 
    //        projectIds.map(projectId =>
    //        this.db.collection<Project>('project', ref => ref.where('id', '==', projectId))
    //        .valueChanges().pipe(
    //          map(projects => projects[0]
    //            )
    //        )
    //        )
    //    )
    //       ]
        
    //    )
    //   }),

    //   map(([records,tasks,projects]) =>{
    //     console.log(records);
    //     return records.map(record => {
    //       return {
    //         ...record,
    //         task: tasks.find( t =>t.id === record.taskId),
    //         project: projects.find( p =>p.id === record.projectId)
    //       }
    //     })
    //   }
    //   )
      
    // ).subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log(data);
    // })

    /////////////// record + task + project + company
  this.uiService.loadingStateChanged.next(true);
   this.dataSubscription = (this.db
    .collection<Record>('record')
    .snapshotChanges()
    .pipe(
      switchMap( records =>{
        const taskIds = uniq(records.map(rec => rec.payload.doc.data().taskId));
        const projectIds = uniq(records.map(rec => rec.payload.doc.data().projectId));
        const companyIds = uniq ( this.companies.map(com => com.id))

        return  combineLatest(
          [
            of(records),  

            combineLatest(
            taskIds.map(taskId =>
            this.db.collection<Task>('task', ref => ref.where('id', '==', taskId))
            .valueChanges().pipe(
              map(tasks => tasks[0] )
              )
            )
        ),

        combineLatest( 
          projectIds.map(projectId =>
          this.db.collection<Project>('project', ref => ref.where('id', '==', projectId))
          .valueChanges().pipe(
            map(projects => projects[0])
           )
          )
      ),

      combineLatest(
        companyIds.map(companyId =>
          this.db.collection<Company>('company', ref => ref.where('id', '==', companyId))
          .valueChanges().pipe(
            map(companies => companies[0])
          )))]
      )
      }),

      map(([records,tasks,projects]) =>{
        return records.map(record => {
          return {
            hour: record.payload.doc.data().hour,
            id: record.payload.doc.id,
            task: tasks.find( t =>t.id === record.payload.doc.data().taskId).name,
            project: projects.find( p =>p.id === record.payload.doc.data().projectId).name,
            company: this.companies.find(c => c.id === (projects.find( p =>p.id === record.payload.doc.data().projectId)).companyId).name
          }
        }) 
      } ))
      .subscribe(data => {
      this.uiService.loadingStateChanged.next(false);
      this.dataSource.data = data;
    })) 
  }
///////////////////////////////end of ngOnInit
onDeleteRecord(recId: string){
  if(confirm("Are you sure to delete this record?")){
    this.db.doc('record/'+ recId).delete();
  }
}

ngAfterViewInit(){
  this.dataSource.paginator = this.paginator; 
  this.dataSource.sort = this.sort;
}

doFilter(filterValue: string){
this.dataSource.filter =filterValue.trim().toLowerCase();
}

ngOnDestroy() {

  if(this.companiesSubscription){
    this.companiesSubscription.unsubscribe();
  }
  if(this.dataSubscription){
    this.dataSubscription.unsubscribe();
  }
  if (this.loadingSubscription) {
    this.loadingSubscription.unsubscribe();
  }
}
}




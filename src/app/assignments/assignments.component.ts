import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';
import { AssignmentDetailComponent } from '../assignment-detail/assignment-detail.component';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],

})
export class AssignmentsComponent implements OnInit {
  titre = 'Liste des assignments';
  couleur = 'violet';
  // Pour la pagination
  page: number = 1;
  limit: number = 5;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;

  // pour l'affichage en table
  displayedColumns: string[] = ['demo-id', 'demo-nom', 'demo-dateDeRendu', 'demo-rendu'];

  assignments: Assignment[] = [];
  assignmentTransmis?: Assignment;

  constructor(private assignmentService: AssignmentsService,
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,config: NgbModalConfig, private ModalService: NgbModal
   , private router: Router,) {}
  pages = 1;
  pageSize = 5;
  modalService: any;
  collectionSize =this.assignments.length;
  ngOnInit(): void {
    // appelé AVANT l'affichage (juste après le constructeur)
    console.log('AVANT AFFICHAGE');
    // on va demander au service de nous renvoyer les données (les assignments)
    // typiquement : le service envoie une requête AJAX sur un web service
    // du cloud...

    this.getAssignments();
  }

  getAssignments() {
    console.log('On demande les assignments au service');
    this.assignmentService
      .getAssignmentsPagine(this.page, this.limit)
      .subscribe((data) => {
        // quand on rentre ici on sait que les données sont prêtes
        console.log('données reçues');
        this.assignments = data.docs;
        this.page = data.page;

        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log('données reçues');
      });

    console.log('demande envoyée au service');
  }
  cancelClicked: boolean = false;
  popoverMessage: string = 'Are you sure to delete this ?';
  deleteCatalogue(id: any) {
    this.assignmentsService.deleteAssignment(id).subscribe(
      () => {
        this.assignments = this.assignments.filter(assignments => assignments.id != id)
      }
    )
  }
 
  pageSuivante() {
    if (this.hasNextPage) {
      this.page = this.nextPage;
      this.getAssignments();
    }
  }

  pagePrecedente() {
    if (this.hasPrevPage) {
      this.page = this.prevPage;
      this.getAssignments();
    }
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }
  closeResult = '';

 
  edit() {
    this.modalService.open(AssignmentDetailComponent);
  }
  
}

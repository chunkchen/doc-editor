const ROWS_HEADER_CLASS = 'table-rows-header';
const ROWS_HEADER_ITEM_CLASS = 'table-rows-header-item';

const HEADER_ADD_CLASS = 'table-header-add-btn';
const HEADER_DELETE_CLASS = 'table-header-delete-btn';

const ROWS_HEADER_TRIGGER_CLASS = 'rows-trigger';


const rowsHeader = '<div class="'
  .concat(ROWS_HEADER_CLASS, '">')
  .concat('<div class="'
    .concat(ROWS_HEADER_ITEM_CLASS, '" draggable="true">'
      .concat('<div class="table-row-header-btns">', '<a class="table-control-icon-btn '
        .concat(HEADER_DELETE_CLASS, '"><span class="lake-icon lake-icon-delete" /></a>'
          .concat('<a class="table-control-icon-btn ', HEADER_ADD_CLASS
            .concat('"><span class="lake-icon lake-icon-plus"/></a></div>')
          )
        )
      ).concat('<div class="row-dragger"> <span class="lake-icon lake-icon-drag"></span><span class="drag-info"></span></div><div class="', ROWS_HEADER_TRIGGER_CLASS
        .concat('"></div></div>')))
    .repeat(4), '')
  .concat('</div> ');
console.log(rowsHeader);

// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { MoreIcon } from 'outline-icons';

import Document from 'models/Document';
import UiStore from 'stores/UiStore';
import { documentMoveUrl } from 'utils/routeHelpers';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';

type Props = {
  ui: UiStore,
  label?: React.Node,
  history: Object,
  document: Document,
  className: string,
  showPrint?: boolean,
};

@observer
class DocumentMenu extends React.Component<Props> {
  handleNewChild = (ev: SyntheticEvent<*>) => {
    const { history, document } = this.props;
    history.push(
      `${document.collection.url}/new?parentDocument=${document.id}`
    );
  };

  handleDelete = (ev: SyntheticEvent<*>) => {
    const { document } = this.props;
    this.props.ui.setActiveModal('document-delete', { document });
  };

  handleMove = (ev: SyntheticEvent<*>) => {
    this.props.history.push(documentMoveUrl(this.props.document));
  };

  handleDuplicate = async (ev: SyntheticEvent<*>) => {
    this.props.document.duplicate();
  };

  handlePin = (ev: SyntheticEvent<*>) => {
    this.props.document.pin();
  };

  handleUnpin = (ev: SyntheticEvent<*>) => {
    this.props.document.unpin();
  };

  handleStar = (ev: SyntheticEvent<*>) => {
    this.props.document.star();
  };

  handleUnstar = (ev: SyntheticEvent<*>) => {
    this.props.document.unstar();
  };

  handleExport = (ev: SyntheticEvent<*>) => {
    this.props.document.download();
  };

  handleShareLink = async (ev: SyntheticEvent<*>) => {
    const { document } = this.props;
    if (!document.shareUrl) await document.share();

    this.props.ui.setActiveModal('document-share', { document });
  };

  render() {
    const { document, label, className, showPrint } = this.props;
    const isDraft = !document.publishedAt;

    return (
      <DropdownMenu label={label || <MoreIcon />} className={className}>
        {!isDraft && (
          <React.Fragment>
            {document.pinned ? (
              <DropdownMenuItem onClick={this.handleUnpin}>
                Unpin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={this.handlePin}>Pin</DropdownMenuItem>
            )}
            {document.starred ? (
              <DropdownMenuItem onClick={this.handleUnstar}>
                Unstar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={this.handleStar}>
                Star
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={this.handleShareLink}
              title="Create a public share link"
            >
              Share link…
            </DropdownMenuItem>
            <hr />
            <DropdownMenuItem
              onClick={this.handleNewChild}
              title="Create a new child document for the current document"
            >
              New child document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={this.handleDuplicate}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={this.handleMove}>Move…</DropdownMenuItem>
          </React.Fragment>
        )}
        <DropdownMenuItem onClick={this.handleDelete}>Delete…</DropdownMenuItem>
        <hr />
        <DropdownMenuItem onClick={this.handleExport}>
          Download
        </DropdownMenuItem>
        {showPrint && (
          <DropdownMenuItem onClick={window.print}>Print</DropdownMenuItem>
        )}
      </DropdownMenu>
    );
  }
}

export default withRouter(inject('ui')(DocumentMenu));

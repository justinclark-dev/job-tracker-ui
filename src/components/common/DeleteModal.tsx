import './Modal.css';
import cancel from '/images/cancel.png';
import trash from '/images/trash.png';

interface Modal {
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: Modal) => {
  
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-panel'>
        <p>Are you sure you want to delete this Job Application?</p>
        <div className="modal-buttons">
          <button className='primary' onClick={onClose}>
            <img src={cancel} className='icon' alt='Cancel icon' />
            Cancel

          </button>
          <button className='delete' onClick={onConfirm}>
            <img src={trash} className='icon' alt='Delete icon' />
            Delete

          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
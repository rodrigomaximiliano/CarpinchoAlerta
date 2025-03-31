"""Create initial tables (users, reports)

Revision ID: 43d041811d0e
Revises: 
Create Date: 2025-03-31 10:45:42.183082

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql # Aunque usemos SQLite, el Enum puede necesitarlo

# revision identifiers, used by Alembic.
revision: str = '43d041811d0e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create users and reports tables."""
    # ### commands manually adjusted for initial creation ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('is_active', sa.Boolean(), server_default=sa.text('1'), nullable=False),
    sa.Column('full_name', sa.String(), nullable=True),
    # Definir Enum explícitamente para compatibilidad
    sa.Column('role', sa.Enum('citizen', 'admin', 'firefighter', name='userrole'), 
              nullable=False, server_default='citizen'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_full_name'), 'users', ['full_name'], unique=False)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table('reports',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('department', sa.String(), nullable=True),
    sa.Column('paraje', sa.String(), nullable=True),
    sa.Column('photo_url', sa.String(), nullable=True),
    # Definir Enum explícitamente
    sa.Column('status', sa.Enum('PENDING', 'VERIFIED', 'RESOLVED', 'DISMISSED', name='reportstatus'), 
              nullable=False, server_default='PENDING'),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('reporter_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['reporter_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reports_created_at'), 'reports', ['created_at'], unique=False)
    op.create_index(op.f('ix_reports_department'), 'reports', ['department'], unique=False)
    op.create_index(op.f('ix_reports_id'), 'reports', ['id'], unique=False)
    op.create_index(op.f('ix_reports_latitude'), 'reports', ['latitude'], unique=False)
    op.create_index(op.f('ix_reports_longitude'), 'reports', ['longitude'], unique=False)
    op.create_index(op.f('ix_reports_paraje'), 'reports', ['paraje'], unique=False)
    op.create_index(op.f('ix_reports_reporter_id'), 'reports', ['reporter_id'], unique=False)
    op.create_index(op.f('ix_reports_status'), 'reports', ['status'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Drop users and reports tables."""
    # ### commands manually adjusted ###
    op.drop_index(op.f('ix_reports_status'), table_name='reports')
    op.drop_index(op.f('ix_reports_reporter_id'), table_name='reports')
    op.drop_index(op.f('ix_reports_paraje'), table_name='reports')
    op.drop_index(op.f('ix_reports_longitude'), table_name='reports')
    op.drop_index(op.f('ix_reports_latitude'), table_name='reports')
    op.drop_index(op.f('ix_reports_id'), table_name='reports')
    op.drop_index(op.f('ix_reports_department'), table_name='reports')
    op.drop_index(op.f('ix_reports_created_at'), table_name='reports')
    op.drop_table('reports')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_full_name'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    # Drop Enum types (puede fallar en algunos backends si están en uso)
    sa.Enum(name='userrole').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='reportstatus').drop(op.get_bind(), checkfirst=False)
    # ### end Alembic commands ###

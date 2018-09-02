"""empty message

Revision ID: 596b4b33583b
Revises: 
Create Date: 2018-08-29 02:07:47.025295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '596b4b33583b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('record', sa.Column('date_day', sa.Integer(), nullable=True))
    op.add_column('record', sa.Column('date_month', sa.Integer(), nullable=True))
    op.add_column('record', sa.Column('date_year', sa.Integer(), nullable=True))
    op.add_column('record', sa.Column('things', sa.String(length=120), nullable=True))
    op.drop_column('record', 'name')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('record', sa.Column('name', sa.VARCHAR(length=120), nullable=True))
    op.drop_column('record', 'things')
    op.drop_column('record', 'date_year')
    op.drop_column('record', 'date_month')
    op.drop_column('record', 'date_day')
    # ### end Alembic commands ###

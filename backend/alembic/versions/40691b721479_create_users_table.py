"""create users table

Revision ID: 40691b721479
Revises: 
Create Date: 2022-05-19 14:52:14.364888

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import text


# revision identifiers, used by Alembic.
revision = '40691b721479'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('users',
                    sa.Column('id', sa.Integer(), nullable=False,
                              primary_key=True),
                    sa.Column('first_name', sa.String(), nullable=False),
                    sa.Column('last_name', sa.String(), nullable=False,
                              server_default="last_name"),
                    sa.Column('email', sa.String(),
                              nullable=False, unique=True),
                    sa.Column('password', sa.String(), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(
                        timezone=True), nullable=False, server_default=text('now()')),
                    )
    pass


def downgrade():
    op.drop_table('users')
    pass
